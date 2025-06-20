"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Briefcase, Phone, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"

export default function JobsPage() {
  const [jobs, setJobs] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) return

        const q = query(collection(db, "services"), where("serviceType", "==", "jobs"), where("status", "==", "active"))

        const querySnapshot = await getDocs(q)
        const jobData: Service[] = []

        querySnapshot.forEach((doc) => {
          jobData.push({ id: doc.id, ...doc.data() } as Service)
        })

        setJobs(jobData)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const getJobsByType = (type: string) => {
    const filteredJobs = jobs.filter((job) => job.jobType?.toLowerCase() === type.toLowerCase())

    if (searchTerm) {
      return filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filteredJobs
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading jobs...</span>
        </div>
      </div>
    )
  }

  const casualJobs = getJobsByType("casual")
  const permanentJobs = getJobsByType("permanent")

  return (
    <div className="container py-32">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/#services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">Jobs</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Find casual and permanent job opportunities across various industries and sectors. Browse job listings and apply
        directly through our platform.
      </p>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setSearchTerm("")}>Clear</Button>
        </div>
      </div>

      <Tabs defaultValue="casual" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="casual">Casual Jobs</TabsTrigger>
          <TabsTrigger value="permanent">Permanent Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="casual" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Casual Job Opportunities</h2>
          {casualJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💼</div>
              <p className="text-xl font-semibold mb-2">No casual jobs available at the moment</p>
              <p className="text-muted-foreground">Check back later for new opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {casualJobs.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                      <Briefcase className="h-5 w-5 text-yellow-500" />
                    </div>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>
                      {job.company} • {job.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type:</span>
                        <span className="text-sm font-medium">{job.jobType}</span>
                      </div>
                      {job.duration && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Duration:</span>
                          <span className="text-sm font-medium">{job.duration}</span>
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Salary:</span>
                          <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{job.salary}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm mb-3">{job.description}</p>
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Requirements:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {job.requirements.slice(0, 3).map((req, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Apply Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="permanent" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Permanent Job Opportunities</h2>
          {permanentJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <p className="text-xl font-semibold mb-2">No permanent jobs available at the moment</p>
              <p className="text-muted-foreground">Check back later for new opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {permanentJobs.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>
                      {job.company} • {job.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type:</span>
                        <span className="text-sm font-medium">{job.jobType}</span>
                      </div>
                      {job.experience && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Experience:</span>
                          <span className="text-sm font-medium">{job.experience}</span>
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Salary:</span>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{job.salary}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm mb-3">{job.description}</p>
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Requirements:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {job.requirements.slice(0, 3).map((req, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Apply Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Navigation Options</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline">Exit</Button>
          <Button variant="outline">Back to Menu</Button>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/#services">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>
        </Button>
        <Button variant="outline">
          <Phone className="mr-2 h-4 w-4" /> Contact Customer Care
        </Button>
      </div>
    </div>
  )
}
