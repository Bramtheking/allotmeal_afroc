"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Briefcase,
  Phone,
  Search,
  Loader2,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Calendar,
  Filter,
  Building,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { getMockJobs } from "@/lib/mock-data"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { JobApplicationDialog } from "@/components/job-application-dialog"

// African countries list
const africanCountries = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon",
  "Central African Republic", "Chad", "Comoros", "Congo", "Côte d'Ivoire", "Democratic Republic of the Congo",
  "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia",
  "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar",
  "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger",
  "Nigeria", "Rwanda", "São Tomé and Príncipe", "Senegal", "Seychelles", "Sierra Leone", "Somalia",
  "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [townFilter, setTownFilter] = useState("")
  const [jobTypeFilter, setJobTypeFilter] = useState("")

  // Kenyan towns list (alphabetically sorted)
  const kenyanTowns = [
    "Bungoma", "Eldoret", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kakamega", "Kericho",
    "Kilifi", "Kisii", "Kisumu", "Kitale", "Kitui", "Lamu", "Lodwar", "Machakos",
    "Malindi", "Mandera", "Meru", "Migori", "Mombasa", "Mumias", "Nairobi", "Naivasha",
    "Nakuru", "Nanyuki", "Narok", "Nyeri", "Thika", "Voi", "Wajir", "Webuye"
  ]
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all")
  const [sortBy, setSortBy] = useState<"newest" | "a-z" | "z-a">("newest")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedJobForApplication, setSelectedJobForApplication] = useState<Service | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          console.log("Using mock data for jobs")
          setJobs(getMockJobs())
          setLoading(false)
          return
        }

        const q = query(collection(db, "services"), where("serviceType", "==", "jobs"), where("status", "==", "active"))

        const querySnapshot = await getDocs(q)
        const jobData: Service[] = []

        querySnapshot.forEach((doc) => {
          jobData.push({ id: doc.id, ...doc.data() } as Service)
        })

        console.log("Fetched job services from Firebase:", jobData.length)
        setJobs(jobData.length > 0 ? jobData : getMockJobs())
      } catch (error) {
        console.error("Error fetching jobs:", error)
        setJobs(getMockJobs())
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const getFilteredJobs = () => {
    let filtered = jobs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.town || "Kitale").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by town (assume Kitale if no town specified)
    if (townFilter) {
      filtered = filtered.filter((job) => {
        const jobTown = job.town || "Kitale" // Default to Kitale for old data
        return jobTown.toLowerCase().includes(townFilter.toLowerCase())
      })
    }

    // Filter by job type
    if (jobTypeFilter) {
      filtered = filtered.filter((job) => {
        if (jobTypeFilter === "full-time") return job.jobType === "permanent" || job.jobType === "full-time"
        if (jobTypeFilter === "part-time") return job.jobType === "part-time"
        if (jobTypeFilter === "contract") return job.jobType === "contract" || job.jobType === "casual"
        return true
      })
    }

    // Filter by price
    if (priceFilter !== "all") {
      filtered = filtered.filter((job) => {
        const hasPrice = job.price && job.price.toLowerCase() !== "free" && !job.price.toLowerCase().includes("contact")
        if (priceFilter === "free") return !hasPrice
        if (priceFilter === "paid") return hasPrice
        return true
      })
    }

    // Sort
    if (sortBy === "a-z") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === "z-a") {
      filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title))
    }
    // "newest" is default (already sorted by createdAt from Firebase)

    return filtered
  }

  const getJobsByType = (type: string) => {
    const filtered = getFilteredJobs()
    if (type === "all") return filtered

    return filtered.filter((job) => {
      if (type === "full-time") return job.jobType === "permanent" || job.jobType === "full-time"
      if (type === "part-time") return job.jobType === "part-time"
      if (type === "contract") return job.jobType === "contract" || job.jobType === "casual"
      return job.jobType?.toLowerCase() === type.toLowerCase()
    })
  }

  const handleSearch = () => {
    console.log("Searching with:", { searchTerm, townFilter, jobTypeFilter })
  }

  const handleApplyNow = (job: Service) => {
    setSelectedJobForApplication(job)
    setShowPaymentDialog(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-950/20 dark:via-gray-950 dark:to-blue-950/20">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <span className="text-lg font-medium bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Loading career opportunities...
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const allJobs = getJobsByType("all")
  const fullTimeJobs = getJobsByType("full-time")
  const partTimeJobs = getJobsByType("part-time")
  const contractJobs = getJobsByType("contract")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-950/20 dark:via-gray-950 dark:to-blue-950/20">
      {/* Hero Section with Job Search */}
      <div className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-teal-400/20 to-blue-500/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="container relative py-20">
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="outline"
              size="icon"
              asChild
              className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30"
            >
              <Link href="/#services">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              Career &
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Opportunities
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Discover your dream career with premium job opportunities from Africa's leading companies and innovative
              startups.
            </p>
          </motion.div>

          {/* Job Search Box */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Job Title or Keywords</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
                    <Input
                      placeholder="e.g. Software Engineer, Marketing..."
                      className="pl-10 h-12 border-gray-200 focus:border-emerald-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Town</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-500 z-10 pointer-events-none" />
                    <select
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-teal-400 bg-white text-gray-900"
                      value={townFilter}
                      onChange={(e) => setTownFilter(e.target.value)}
                    >
                      <option value="" className="text-gray-900">All Towns</option>
                      {kenyanTowns.map((town) => (
                        <option key={town} value={town} className="text-gray-900">
                          {town}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Job Type</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                    <select
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-blue-400 bg-white text-gray-900"
                      value={jobTypeFilter}
                      onChange={(e) => setJobTypeFilter(e.target.value)}
                    >
                      <option value="" className="text-gray-900">All Types</option>
                      <option value="full-time" className="text-gray-900">Full Time</option>
                      <option value="part-time" className="text-gray-900">Part Time</option>
                      <option value="contract" className="text-gray-900">Contract</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Price</label>
                  <select
                    className="w-full h-12 border border-gray-200 rounded-lg focus:border-emerald-400 bg-white text-gray-900 px-4"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value as "all" | "free" | "paid")}
                  >
                    <option value="all" className="text-gray-900">All Prices</option>
                    <option value="free" className="text-gray-900">Free / Contact for Quote</option>
                    <option value="paid" className="text-gray-900">Paid Positions</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Sort By</label>
                  <select
                    className="w-full h-12 border border-gray-200 rounded-lg focus:border-emerald-400 bg-white text-gray-900 px-4"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "newest" | "a-z" | "z-a")}
                  >
                    <option value="newest" className="text-gray-900">Newest First</option>
                    <option value="a-z" className="text-gray-900">Title: A to Z</option>
                    <option value="z-a" className="text-gray-900">Title: Z to A</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">&nbsp;</label>
                  <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 h-12 flex items-center">
                    Showing {getFilteredJobs().length} of {jobs.length} jobs
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <Button
                  className="flex-1 h-12 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Jobs
                </Button>
                <Button
                  variant="outline"
                  className="md:w-auto h-12 border-gray-300 hover:bg-gray-50 bg-transparent"
                  onClick={() => {
                    setSearchTerm("")
                    setTownFilter("")
                    setJobTypeFilter("")
                    setPriceFilter("all")
                    setSortBy("newest")
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Clear All Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-20">
        {/* Search Results Summary */}
        {(searchTerm || townFilter || jobTypeFilter || priceFilter !== "all" || sortBy !== "newest") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Search Results</h3>
                  <p className="text-gray-600">Found {allJobs.length} job opportunities</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setTownFilter("")
                    setJobTypeFilter("")
                    setPriceFilter("all")
                    setSortBy("newest")
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
              {(searchTerm || townFilter || jobTypeFilter || priceFilter !== "all" || sortBy !== "newest") && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {searchTerm && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                  {townFilter && (
                    <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                      Town: "{townFilter}"
                    </Badge>
                  )}
                  {jobTypeFilter && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Type: {jobTypeFilter.charAt(0).toUpperCase() + jobTypeFilter.slice(1)}
                    </Badge>
                  )}
                  {priceFilter !== "all" && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      Price: {priceFilter === "free" ? "Free" : "Paid"}
                    </Badge>
                  )}
                  {sortBy !== "newest" && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Sort: {sortBy === "a-z" ? "A to Z" : "Z to A"}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Featured Jobs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Premium Career Opportunities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with top employers offering exceptional career growth and competitive benefits
            </p>
          </div>

          <Tabs defaultValue="all" className="mb-12">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm border-emerald-200 shadow-lg">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
              >
                All ({allJobs.length})
              </TabsTrigger>
              <TabsTrigger
                value="full-time"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Full Time ({fullTimeJobs.length})
              </TabsTrigger>
              <TabsTrigger
                value="part-time"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
              >
                <Clock className="h-4 w-4 mr-2" />
                Part Time ({partTimeJobs.length})
              </TabsTrigger>
              <TabsTrigger
                value="contract"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                Contract ({contractJobs.length})
              </TabsTrigger>
            </TabsList>

            {/* All Jobs Tab */}
            <TabsContent value="all" className="space-y-6">
              {allJobs.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
                    <Briefcase className="h-20 w-20 text-emerald-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">No Jobs Found</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    {searchTerm || townFilter || jobTypeFilter
                      ? "Try adjusting your search filters to find more opportunities."
                      : "We're partnering with leading companies to bring you exceptional career opportunities. Premium positions launching soon!"}
                  </p>
                  <Button
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-lg px-8 py-3"
                    onClick={() => {
                      setSearchTerm("")
                      setTownFilter("")
                      setJobTypeFilter("")
                    }}
                  >
                    {searchTerm || townFilter || jobTypeFilter ? "Clear Filters" : "Get Job Alerts"}
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {allJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-500 border-0 h-full">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <CardTitle className="text-xl font-bold group-hover:text-emerald-600 transition-colors duration-300">
                                {job.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Building className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm font-medium">{job.company || "Growing Company"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-4 w-4 text-teal-500" />
                                <span className="text-sm">{(job.town || "Kitale") + ", Kenya"}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                {job.jobType === "permanent" ? "Full Time" : job.jobType || "Full Time"}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{job.description}</p>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-gray-600">{job.salary || job.price || "Competitive"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span className="text-xs text-gray-600">
                                {job.jobType === "permanent" ? "Full Time" : job.jobType || "Full Time"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-purple-500" />
                              <span className="text-xs text-gray-600">{job.experience || "All Levels"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-orange-500" />
                              <span className="text-xs text-gray-600">Posted recently</span>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="grid grid-cols-2 gap-3 pt-6">
                          <Button
                            variant="outline"
                            asChild
                            className="border-emerald-200 hover:bg-emerald-50 bg-transparent"
                          >
                            <Link href={`/services/jobs/${job.slug || job.id}`}>View Details</Link>
                          </Button>
                          <Button
                            onClick={() => handleApplyNow(job)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                          >
                            Apply Now
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Full Time Jobs Tab */}
            <TabsContent value="full-time" className="space-y-6">
              {fullTimeJobs.length === 0 ? (
                <motion.div className="text-center py-20">
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center">
                    <Briefcase className="h-20 w-20 text-emerald-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4">No Full-Time Jobs Found</h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
                    {searchTerm || townFilter
                      ? "Try adjusting your search filters."
                      : "Full-time opportunities coming soon!"}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {fullTimeJobs.map((job, index) => (
                    <Card
                      key={job.id}
                      className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-500 border-0 h-full"
                    >
                      <CardHeader>
                        <CardTitle className="group-hover:text-emerald-600 transition-colors">{job.title}</CardTitle>
                        <CardDescription>{job.company}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.town || "Kitale"}, Kenya
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary || job.price || "Competitive"}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="grid grid-cols-2 gap-3">
                        <Button variant="outline" asChild>
                          <Link href={`/services/jobs/${job.id}`}>View Details</Link>
                        </Button>
                        <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-500">
                          <Link href={`/services/jobs/${job.id}`}>Apply Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Part Time Jobs Tab */}
            <TabsContent value="part-time" className="space-y-6">
              {partTimeJobs.length === 0 ? (
                <motion.div className="text-center py-20">
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center">
                    <Clock className="h-20 w-20 text-emerald-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4">No Part-Time Jobs Found</h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
                    {searchTerm || townFilter
                      ? "Try adjusting your search filters."
                      : "Part-time opportunities coming soon!"}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {partTimeJobs.map((job, index) => (
                    <Card
                      key={job.id}
                      className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-500 border-0 h-full"
                    >
                      <CardHeader>
                        <CardTitle className="group-hover:text-emerald-600 transition-colors">{job.title}</CardTitle>
                        <CardDescription>{job.company}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                      </CardContent>
                      <CardFooter className="grid grid-cols-2 gap-3">
                        <Button variant="outline" asChild>
                          <Link href={`/services/jobs/${job.id}`}>View Details</Link>
                        </Button>
                        <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-500">
                          <Link href={`/services/jobs/${job.id}`}>Apply Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Contract Jobs Tab */}
            <TabsContent value="contract" className="space-y-6">
              {contractJobs.length === 0 ? (
                <motion.div className="text-center py-20">
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center">
                    <Users className="h-20 w-20 text-emerald-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4">No Contract Jobs Found</h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
                    {searchTerm || townFilter
                      ? "Try adjusting your search filters."
                      : "Contract opportunities coming soon!"}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {contractJobs.map((job, index) => (
                    <Card
                      key={job.id}
                      className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-500 border-0 h-full"
                    >
                      <CardHeader>
                        <CardTitle className="group-hover:text-emerald-600 transition-colors">{job.title}</CardTitle>
                        <CardDescription>{job.company}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                      </CardContent>
                      <CardFooter className="grid grid-cols-2 gap-3">
                        <Button variant="outline" asChild>
                          <Link href={`/services/jobs/${job.id}`}>View Details</Link>
                        </Button>
                        <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-500">
                          <Link href={`/services/jobs/${job.id}`}>Apply Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-emerald-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-3xl border border-emerald-100 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Ready to Find Your Dream Job?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get personalized job recommendations and connect with our career advisors for expert guidance. Available 24/7 to help you succeed.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                className="h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-8 text-lg"
                asChild
              >
                <a href="tel:+254701524543">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: +254 701 524543
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="h-14 border-emerald-200 hover:bg-emerald-50 px-8 text-lg"
                asChild
              >
                <a href="mailto:allotmealafrockenya@gmail.com">
                  ✉️ Email Support
                </a>
              </Button>
              <Button 
                className="h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 text-lg"
                asChild
              >
                <a href="https://wa.me/254701524543" target="_blank" rel="noopener noreferrer">
                  💬 WhatsApp Chat
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Job Application Dialog */}
      {selectedJobForApplication && (
        <JobApplicationDialog
          isOpen={showPaymentDialog}
          onClose={() => {
            setShowPaymentDialog(false)
            setSelectedJobForApplication(null)
          }}
          jobTitle={selectedJobForApplication.title}
          jobId={selectedJobForApplication.id || ""}
        />
      )}
    </div>
  )
}



