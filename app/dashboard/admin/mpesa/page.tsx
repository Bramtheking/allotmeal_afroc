"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { ArrowLeft, Loader2, DollarSign, Users, Play, Pause, Trash2, Plus, Edit } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
  getMpesaSettings,
  updateMpesaSettings,
  getAllServicePricing,
  setServicePricing,
  deleteServicePricing,
  getWhitelist,
  addToWhitelist,
  removeFromWhitelist,
  type MpesaServicePricing,
  type MpesaWhitelistEntry,
} from "@/lib/mpesa-firebase"

const serviceTypes = [
  { value: "hotel-industry", label: "Hotel & Industry" },
  { value: "jobs", label: "Jobs" },
  { value: "construction", label: "Construction" },
  { value: "agriculture", label: "Agriculture" },
  { value: "entertainment", label: "Entertainment" },
  { value: "sme-products", label: "SME Products" },
  { value: "tenders", label: "Tenders" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "transport", label: "Transport" },
  { value: "sermon", label: "Sermon" },
]

export default function MpesaAdminPage() {
  const { user, userRole, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [pricing, setPricing] = useState<MpesaServicePricing[]>([])
  const [whitelist, setWhitelist] = useState<MpesaWhitelistEntry[]>([])
  
  const [selectedService, setSelectedService] = useState("")
  const [continueAmount, setContinueAmount] = useState("")
  const [videosAmount, setVideosAmount] = useState("")
  const [postServiceAmount, setPostServiceAmount] = useState("")
  const [jobApplicationAmount, setJobApplicationAmount] = useState("")
  const [editingService, setEditingService] = useState<string | null>(null)
  
  const [whitelistType, setWhitelistType] = useState<"phone" | "email">("phone")
  const [whitelistValue, setWhitelistValue] = useState("")

  useEffect(() => {
    if (authLoading) return

    if (!user || userRole !== "admin") {
      router.push("/dashboard")
      return
    }

    loadData()
  }, [user, userRole, router, authLoading])

  const loadData = async () => {
    setLoading(true)
    try {
      const [settings, pricingData, whitelistData] = await Promise.all([
        getMpesaSettings(),
        getAllServicePricing(),
        getWhitelist(),
      ])

      if (settings) {
        setIsPaused(settings.isPaused)
      }
      setPricing(pricingData)
      setWhitelist(whitelistData.filter(w => !w.deleted))
    } catch (error) {
      console.error("Error loading M-Pesa data:", error)
      toast.error("Failed to load M-Pesa settings")
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePause = async () => {
    if (!user) return
    
    try {
      const newPausedState = !isPaused
      await updateMpesaSettings({ isPaused: newPausedState }, user.uid)
      setIsPaused(newPausedState)
      toast.success(newPausedState ? "M-Pesa payments paused" : "M-Pesa payments resumed")
    } catch (error) {
      console.error("Error toggling pause:", error)
      toast.error("Failed to update settings")
    }
  }

  const handleSavePricing = async () => {
    if (!user || !selectedService) {
      toast.error("Please select a service")
      return
    }

    if (!continueAmount && !videosAmount && !postServiceAmount && !jobApplicationAmount) {
      toast.error("Please enter at least one amount")
      return
    }

    try {
      const pricingData: any = {
        serviceType: selectedService,
        continueAmount: parseFloat(continueAmount) || 0,
        videosAmount: parseFloat(videosAmount) || 0,
        postServiceAmount: parseFloat(postServiceAmount) || 0,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid,
      }

      // Add job application amount for jobs service (always include it, even if 0)
      if (selectedService === "jobs") {
        pricingData.jobApplicationAmount = parseFloat(jobApplicationAmount) || 0
        console.log("Saving job application amount:", pricingData.jobApplicationAmount)
      }

      console.log("Saving pricing data:", pricingData)
      await setServicePricing(pricingData, user.uid)

      toast.success("Pricing updated successfully")
      loadData()
      setSelectedService("")
      setContinueAmount("")
      setVideosAmount("")
      setPostServiceAmount("")
      setJobApplicationAmount("")
      setEditingService(null)
    } catch (error) {
      console.error("Error saving pricing:", error)
      toast.error("Failed to save pricing")
    }
  }

  const handleEditPricing = (item: MpesaServicePricing) => {
    setSelectedService(item.serviceType)
    setContinueAmount(item.continueAmount.toString())
    setVideosAmount(item.videosAmount.toString())
    setPostServiceAmount(item.postServiceAmount?.toString() || "0")
    setJobApplicationAmount(item.jobApplicationAmount?.toString() || "0")
    setEditingService(item.serviceType)
  }

  const handleDeletePricing = async (serviceType: string) => {
    if (!confirm(`Are you sure you want to delete pricing for ${serviceTypes.find(s => s.value === serviceType)?.label || serviceType}?`)) {
      return
    }

    try {
      await deleteServicePricing(serviceType)
      toast.success("Pricing deleted successfully")
      loadData()
    } catch (error) {
      console.error("Error deleting pricing:", error)
      toast.error("Failed to delete pricing")
    }
  }

  const handleCancelEdit = () => {
    setSelectedService("")
    setContinueAmount("")
    setVideosAmount("")
    setPostServiceAmount("")
    setJobApplicationAmount("")
    setEditingService(null)
  }

  const handleAddToWhitelist = async () => {
    if (!user || !whitelistValue) {
      toast.error("Please enter a value")
      return
    }

    try {
      await addToWhitelist(
        {
          type: whitelistType,
          value: whitelistValue,
          addedAt: new Date().toISOString(),
          addedBy: user.uid,
        },
        user.uid
      )

      toast.success("Added to whitelist")
      loadData()
      setWhitelistValue("")
    } catch (error) {
      console.error("Error adding to whitelist:", error)
      toast.error("Failed to add to whitelist")
    }
  }

  const handleRemoveFromWhitelist = async (id: string) => {
    try {
      await removeFromWhitelist(id)
      toast.success("Removed from whitelist")
      loadData()
    } catch (error) {
      console.error("Error removing from whitelist:", error)
      toast.error("Failed to remove from whitelist")
    }
  }

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
        <Link href="/dashboard/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">M-Pesa Settings</h1>
          <p className="text-muted-foreground">Manage M-Pesa payment configuration</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isPaused ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              Payment Status
            </CardTitle>
            <CardDescription>
              Control whether M-Pesa payments are required
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">M-Pesa Payment Requirement</p>
                <p className="text-sm text-muted-foreground">
                  {isPaused ? "Payments are currently paused" : "Payments are active"}
                </p>
              </div>
              <Switch checked={!isPaused} onCheckedChange={handleTogglePause} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Service Pricing
            </CardTitle>
            <CardDescription>
              Set payment amounts for Continue, Videos, Post Service, and Job Applications per service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label>Service</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Continue Amount (KSh)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={continueAmount}
                  onChange={(e) => setContinueAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  To view service details • Set to 0 to make free
                </p>
              </div>

              <div className="space-y-2">
                <Label>Videos Amount (KSh)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={videosAmount}
                  onChange={(e) => setVideosAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  To view service videos • Set to 0 to make free
                </p>
              </div>

              <div className="space-y-2">
                <Label>Post Service Amount (KSh)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={postServiceAmount}
                  onChange={(e) => setPostServiceAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  To post a service in this category • Set to 0 to make free
                </p>
              </div>

              {selectedService === "jobs" && (
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label>Job Application Amount (KSh)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={jobApplicationAmount}
                    onChange={(e) => setJobApplicationAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Amount to apply for a job • Set to 0 for free applications
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSavePricing}>
                {editingService ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Pricing
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Save Pricing
                  </>
                )}
              </Button>
              {editingService && (
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>

            {pricing.length > 0 && (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Continue</TableHead>
                      <TableHead className="text-right">Videos</TableHead>
                      <TableHead className="text-right">Post Service</TableHead>
                      <TableHead className="text-right">Job Application</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricing.map((item) => (
                      <TableRow key={item.serviceType}>
                        <TableCell className="font-medium">
                          {serviceTypes.find((s) => s.value === item.serviceType)?.label || item.serviceType}
                        </TableCell>
                        <TableCell className="text-right">KSh {item.continueAmount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">KSh {item.videosAmount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">KSh {(item.postServiceAmount || 0).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {item.serviceType === "jobs" ? `KSh ${(item.jobApplicationAmount || 0).toFixed(2)}` : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPricing(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePricing(item.serviceType)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Whitelist
            </CardTitle>
            <CardDescription>
              Add phone numbers or emails to bypass payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={whitelistType} onValueChange={(val) => setWhitelistType(val as "phone" | "email")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone Number</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>{whitelistType === "phone" ? "Phone Number" : "Email Address"}</Label>
                <div className="flex gap-2">
                  <Input
                    type={whitelistType === "email" ? "email" : "text"}
                    placeholder={whitelistType === "phone" ? "254712345678" : "user@example.com"}
                    value={whitelistValue}
                    onChange={(e) => setWhitelistValue(e.target.value)}
                  />
                  <Button onClick={handleAddToWhitelist}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {whitelist.length > 0 && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {whitelist.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant={item.type === "phone" ? "default" : "secondary"}>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{item.value}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => item.id && handleRemoveFromWhitelist(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
