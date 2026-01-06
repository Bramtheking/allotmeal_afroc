"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { Loader2, Trophy, Heart, Search, Download, Eye, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

interface CoupleEntry {
  id: string
  country: string
  city: string
  gender: string
  dob: string
  promoCode?: string
  answers: Record<number, string>
  status: "pending" | "approved" | "winner" | "rejected"
  paymentStatus: "pending" | "completed"
  paymentAmount: number
  score: number
  createdAt: string
}

export default function CouplesDayAdminPage() {
  const [entries, setEntries] = useState<CoupleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedEntry, setSelectedEntry] = useState<CoupleEntry | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.error("Database not available")
        return
      }

      const querySnapshot = await getDocs(collection(db, "couples_entries"))
      const entriesData: CoupleEntry[] = []

      querySnapshot.forEach((doc) => {
        entriesData.push({ id: doc.id, ...doc.data() } as CoupleEntry)
      })

      // Sort by creation date, newest first
      entriesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setEntries(entriesData)
    } catch (error) {
      console.error("Error fetching entries:", error)
      toast.error("Failed to fetch entries")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (entryId: string, newStatus: "approved" | "winner" | "rejected") => {
    setUpdating(entryId)
    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.error("Database not available")
        return
      }

      await updateDoc(doc(db, "couples_entries", entryId), {
        status: newStatus,
      })

      setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, status: newStatus } : entry)))

      toast.success(`Status updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    } finally {
      setUpdating(null)
    }
  }

  const handleScoreChange = async (entryId: string, newScore: number) => {
    setUpdating(entryId)
    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.error("Database not available")
        return
      }

      await updateDoc(doc(db, "couples_entries", entryId), {
        score: newScore,
      })

      setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, score: newScore } : entry)))

      toast.success("Score updated")
    } catch (error) {
      console.error("Error updating score:", error)
      toast.error("Failed to update score")
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    setUpdating(entryId)
    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.error("Database not available")
        return
      }

      await deleteDoc(doc(db, "couples_entries", entryId))
      setEntries((prev) => prev.filter((entry) => entry.id !== entryId))
      toast.success("Entry deleted")
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast.error("Failed to delete entry")
    } finally {
      setUpdating(null)
    }
  }

  const exportToCSV = () => {
    const headers = ["ID", "Country", "City", "Gender", "DOB", "Promo Code", "Score", "Status", "Payment", "Created At"]
    const rows = filteredEntries.map((entry) => [
      entry.id,
      entry.country,
      entry.city,
      entry.gender,
      entry.dob,
      entry.promoCode || "N/A",
      entry.score,
      entry.status,
      entry.paymentStatus,
      new Date(entry.createdAt).toLocaleString(),
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `couples-day-entries-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.gender.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || entry.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: entries.length,
    paid: entries.filter((e) => e.paymentStatus === "completed").length,
    pending: entries.filter((e) => e.status === "pending").length,
    winners: entries.filter((e) => e.status === "winner").length,
    revenue: entries.filter((e) => e.paymentStatus === "completed").reduce((sum, e) => sum + e.paymentAmount, 0),
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Heart className="h-8 w-8 text-pink-600" />
          World Couple's Day - Entries Management
        </h1>
        <p className="text-muted-foreground">View and manage competition entries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Winners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.winners}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">KSh {stats.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by country, city, or gender..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="winner">Winners</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className={updating === entry.id ? "opacity-50" : ""}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Entry Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        {entry.city}, {entry.country}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {entry.gender} • DOB: {entry.dob}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          entry.status === "winner"
                            ? "default"
                            : entry.status === "approved"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {entry.status}
                      </Badge>
                      <Badge variant={entry.paymentStatus === "completed" ? "default" : "destructive"}>
                        {entry.paymentStatus === "completed" ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Score:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="number"
                          value={entry.score}
                          onChange={(e) => handleScoreChange(entry.id, parseInt(e.target.value) || 0)}
                          className="w-20 h-8"
                          disabled={updating === entry.id}
                        />
                        <span className="text-xs text-muted-foreground">/ 100</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payment:</span>
                      <p className="font-semibold mt-1">KSh {entry.paymentAmount}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Promo Code:</span>
                      <p className="font-semibold mt-1">{entry.promoCode || "None"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submitted:</span>
                      <p className="font-semibold mt-1">{new Date(entry.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {selectedEntry?.id === entry.id ? "Hide" : "View"} Answers
                  </Button>

                  {selectedEntry?.id === entry.id && (
                    <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                      <h4 className="font-semibold mb-3">Quiz Answers:</h4>
                      {Object.entries(entry.answers).map(([questionId, answer]) => (
                        <div key={questionId} className="text-sm">
                          <span className="font-medium">Q{questionId}:</span> {answer}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:w-48">
                  <Select
                    value={entry.status}
                    onValueChange={(value) => handleStatusChange(entry.id, value as any)}
                    disabled={updating === entry.id}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="winner">Winner</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                    disabled={updating === entry.id}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No entries found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
