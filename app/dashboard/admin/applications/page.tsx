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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Loader2, Mail, Phone, FileText, Download, ExternalLink, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"

interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  fullName: string
  email: string
  phone: string
  coverLetter?: string
  resumeUrl?: string
  resumeFileName?: string
  applicationFee: number
  appliedAt: string
  userId?: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
  read: boolean
}

export default function ApplicationsPage() {
  const { user, userRole } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    if (!user || userRole !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchApplications()
  }, [user, userRole, router])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.error("Database not available")
        return
      }

      const q = query(collection(db, "job_applications"), orderBy("appliedAt", "desc"))
      const querySnapshot = await getDocs(q)
      
      const apps: JobApplication[] = []
      querySnapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() } as JobApplication)
      })

      setApplications(apps)
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast.error("Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  const handleViewApplication = async (application: JobApplication) => {
    setSelectedApplication(application)
    setShowDialog(true)

    // Mark as read
    if (!application.read) {
      try {
        const db = await getFirebaseDb()
        if (db) {
          await updateDoc(doc(db, "job_applications", application.id), { read: true })
          // Update local state
          setApplications(apps => 
            apps.map(app => app.id === application.id ? { ...app, read: true } : app)
          )
        }
      } catch (error) {
        console.error("Error marking as read:", error)
      }
    }
  }

  const handleEmailApplicant = (application: JobApplication) => {
    const subject = encodeURIComponent(`Re: Your Application for ${application.jobTitle}`)
    const body = encodeURIComponent(
      `Dear ${application.fullName},\n\n` +
      `Thank you for applying for the position of ${application.jobTitle}.\n\n` +
      `\n\n` +
      `Best regards,\n` +
      `AllotMeal Afroc Ltd Co.`
    )
    
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${application.email}&su=${subject}&body=${body}`, '_blank')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "reviewed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "accepted": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  if (loading) {
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
          <h1 className="text-3xl font-bold">Job Applications</h1>
          <p className="text-muted-foreground">View and manage job applications</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications ({applications.length})</CardTitle>
          <CardDescription>
            {applications.filter(a => !a.read).length} unread applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No applications yet</p>
              <p className="text-sm text-muted-foreground">Applications will appear here when candidates apply</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow 
                      key={application.id}
                      className={!application.read ? "bg-blue-50/50 dark:bg-blue-950/10" : ""}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!application.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <div>
                            <div className="font-medium">{application.fullName}</div>
                            <div className="text-sm text-muted-foreground">{application.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{application.jobTitle}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewApplication(application)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEmailApplicant(application)}
                          >
                            <Mail className="h-4 w-4" />
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

      {/* Application Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {selectedApplication?.jobTitle}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-lg font-medium">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Applied Date</label>
                  <p className="text-lg">{new Date(selectedApplication.appliedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${selectedApplication.email}`} className="text-primary hover:underline">
                      {selectedApplication.email}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedApplication.phone}`} className="text-primary hover:underline">
                      {selectedApplication.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cover Letter</label>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                  </div>
                </div>
              )}

              {/* Resume */}
              {selectedApplication.resumeUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Resume/CV</label>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" asChild>
                      <a href={selectedApplication.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Resume
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={selectedApplication.resumeUrl} download={selectedApplication.resumeFileName}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {/* Application Fee */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Application Fee</label>
                <p className="text-lg font-medium">
                  {selectedApplication.applicationFee === 0 ? "Free" : `KSh ${selectedApplication.applicationFee.toFixed(2)}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleEmailApplicant(selectedApplication)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Applicant
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
