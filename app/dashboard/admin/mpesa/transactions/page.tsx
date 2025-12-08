"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Download, CheckCircle2, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { getTransactions, type MpesaTransaction } from "@/lib/mpesa-firebase"

export default function MpesaTransactionsPage() {
  const { user, userRole, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<MpesaTransaction[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterService, setFilterService] = useState<string>("all")

  useEffect(() => {
    if (authLoading) return

    if (!user || userRole !== "admin") {
      router.push("/dashboard")
      return
    }

    loadTransactions()
  }, [user, userRole, router, authLoading])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const data = await getTransactions(100)
      setTransactions(data)
    } catch (error) {
      console.error("Error loading transactions:", error)
      toast.error("Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string, resultCode?: number) => {
    if (resultCode === 0 || status === "success") {
      return (
        <Badge className="bg-green-500">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Success
        </Badge>
      )
    } else if (status === "failed" || (resultCode && resultCode !== 0)) {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      )
    } else {
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Phone Number",
      "Amount",
      "Service",
      "Action",
      "Status",
      "Receipt Number",
      "Result Description",
    ]

    const rows = filteredTransactions.map((tx) => [
      new Date(tx.timestamp).toLocaleString(),
      tx.phoneNumber,
      tx.amount,
      tx.serviceType,
      tx.actionType,
      tx.status,
      tx.mpesaReceiptNumber || "",
      tx.resultDesc || "",
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `mpesa_transactions_${new Date().toISOString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Transactions exported successfully")
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (filterStatus !== "all" && tx.status !== filterStatus) return false
    if (filterService !== "all" && tx.serviceType !== filterService) return false
    return true
  })

  const totalAmount = filteredTransactions
    .filter((tx) => tx.resultCode === 0 || tx.status === "success")
    .reduce((sum, tx) => sum + tx.amount, 0)

  const serviceTypes = Array.from(new Set(transactions.map((tx) => tx.serviceType)))

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/admin/mpesa">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">M-Pesa Transactions</h1>
          <p className="text-muted-foreground">View and export transaction history</p>
        </div>
        <Button onClick={exportToCSV} disabled={filteredTransactions.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-3xl">{filteredTransactions.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Successful Payments</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {filteredTransactions.filter((tx) => tx.resultCode === 0 || tx.status === "success").length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Amount (Successful)</CardDescription>
            <CardTitle className="text-3xl">KSh {totalAmount.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterService} onValueChange={setFilterService}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No transactions found</div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm">
                        {new Date(tx.timestamp).toLocaleDateString()}{" "}
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{tx.phoneNumber}</TableCell>
                      <TableCell>{tx.serviceType}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.actionType}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">KSh {tx.amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(tx.status, tx.resultCode)}</TableCell>
                      <TableCell className="font-mono text-sm">{tx.mpesaReceiptNumber || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
