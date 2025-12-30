"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  FileText,
  Phone,
  Loader2,
  Building,
  Clock,
  DollarSign,
  MapPin,
  Award,
  Search,
  Filter,
  Target,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

export default function TendersPage() {
  const [tenders, setTenders] = useState<Service[]>([])
  const [filteredTenders, setFilteredTenders] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterIndustry, setFilterIndustry] = useState<string>("all")
  const [filterValue, setFilterValue] = useState<string>("all")

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          console.log("[v0] Firebase not available - no tenders to display")
          setTenders([])
          setFilteredTenders([])
          setLoading(false)
          return
        }

        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "tenders"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const tenderData: Service[] = []

        querySnapshot.forEach((doc) => {
          tenderData.push({ id: doc.id, ...doc.data() } as Service)
        })

        console.log("[v0] Fetched tender data from Firebase:", tenderData.length, "items")
        setTenders(tenderData)
        setFilteredTenders(tenderData)
      } catch (error) {
        console.error("Error fetching tenders:", error)
        setTenders([])
        setFilteredTenders([])
      } finally {
        setLoading(false)
      }
    }

    fetchTenders()
  }, [])

  useEffect(() => {
    let filtered = tenders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (tender) =>
          tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tender.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tender.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tender.town || "Kitale").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by industry
    if (filterIndustry !== "all") {
      filtered = filtered.filter((tender) => tender.category?.toLowerCase() === filterIndustry.toLowerCase())
    }

    // Filter by value range
    if (filterValue !== "all") {
      // This would need more sophisticated parsing in a real app
      filtered = filtered.filter((tender) => {
        const value = (tender as any).value || tender.price || ""
        switch (filterValue) {
          case "0-100k":
            return value.includes("K") && !value.includes("M")
          case "100k-1m":
            return value.includes("K") || (value.includes("M") && Number.parseFloat(value) < 2)
          case "1m+":
            return value.includes("M") && Number.parseFloat(value) >= 1
          default:
            return true
        }
      })
    }

    setFilteredTenders(filtered)
  }, [searchTerm, filterIndustry, filterValue, tenders])

  const getTendersByType = (type: string) => {
    // Since marketing dashboard doesn't save tenderType field, show all tenders
    return filteredTenders
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-950/20 dark:via-gray-950 dark:to-gray-950/20">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-500 to-gray-600 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <span className="text-lg font-medium bg-gradient-to-r from-slate-600 to-gray-700 bg-clip-text text-transparent">
                Loading business opportunities...
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const privateTenders = getTendersByType("private")
  const publicTenders = getTendersByType("public")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-950/20 dark:via-gray-950 dark:to-gray-950/20">
      {/* Hero Section with Tender Search */}
      <div className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-400/30 via-gray-400/20 to-zinc-500/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
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
              Business &
              <br />
              <span className="bg-gradient-to-r from-slate-300 to-gray-300 bg-clip-text text-transparent">
                Tender Opportunities
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Discover lucrative business opportunities, government contracts, and private sector tenders across
              Africa's growing markets.
            </p>
          </motion.div>

          {/* Tender Search Box */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Search Tenders</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input
                      placeholder="Search opportunities..."
                      className="pl-10 h-12 border-gray-200 focus:border-slate-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Industry Sector</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <select
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-slate-400 bg-white"
                      value={filterIndustry}
                      onChange={(e) => setFilterIndustry(e.target.value)}
                    >
                      <option value="all">All Industries</option>
                      <option value="construction">Construction</option>
                      <option value="technology">IT & Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="transportation">Transportation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Tender Value</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-900" />
                    <select
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-gray-400 bg-white"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                    >
                      <option value="all">Any Value</option>
                      <option value="0-100k">$0 - $100K</option>
                      <option value="100k-1m">$100K - $1M</option>
                      <option value="1m+">$1M+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Results</label>
                  <div className="h-12 flex items-center justify-center bg-slate-50 rounded-lg border">
                    <span className="text-sm font-medium text-slate-600">
                      {filteredTenders.length} opportunities found
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <Button
                  className="flex-1 h-12 text-lg bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 shadow-lg"
                  onClick={() => {
                    setSearchTerm("")
                    setFilterIndustry("all")
                    setFilterValue("all")
                  }}
                >
                  <Filter className="mr-2 h-5 w-5" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-20">
        {/* Featured Tenders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-600 to-gray-700 bg-clip-text text-transparent">
              Premium Business Opportunities
            </h2>
            <p className="text-xl text-gray-900 dark:text-gray-300 max-w-3xl mx-auto">
              Access exclusive tender opportunities from leading organizations across Africa
            </p>
          </div>

          <Tabs defaultValue="private" className="mb-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <TabsTrigger
                value="private"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-gray-600 data-[state=active]:text-white"
              >
                <Building className="h-4 w-4 mr-2" />
                Private Sector ({privateTenders.length})
              </TabsTrigger>
              <TabsTrigger
                value="public"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-gray-600 data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Public Sector ({publicTenders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="private" className="space-y-6">
              {privateTenders.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-900/20 dark:to-gray-900/20 flex items-center justify-center">
                    <Building className="h-20 w-20 text-slate-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    No Private Sector Opportunities Found
                  </h3>
                  <p className="text-lg text-gray-900 dark:text-white max-w-md mx-auto mb-8">
                    We're connecting with leading corporations and private organizations. Please check back later for
                    exclusive business opportunities!
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {privateTenders.map((tender, index) => (
                    <motion.div
                      key={tender.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border-0 h-full">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="space-y-2 flex-1">
                              <CardTitle className="text-xl font-bold text-slate-700 dark:text-slate-300">
                                {tender.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-gray-900">
                                <Building className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium">{tender.company || "Leading Corporation"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-900">
                                <MapPin className="h-4 w-4 text-gray-900" />
                                <span className="text-sm">{(tender.town || "Kitale") + ", Kenya"}</span>
                              </div>
                            </div>
                            <Badge className="bg-green-500 text-white">OPEN</Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{tender.description}</p>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-gray-900">Value</span>
                              </div>
                              <p className="font-semibold text-green-600">{(tender as any).value || tender.price || "$500K"}</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <span className="text-xs text-gray-900">Deadline</span>
                              </div>
                              <p className="font-semibold text-orange-600">{tender.deadline || "30 days"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                              {tender.category || "Technology"}
                            </Badge>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                              Private
                            </Badge>
                          </div>
                        </CardContent>

                        <CardFooter className="grid grid-cols-2 gap-3 pt-6">
                          <Button
                            variant="outline"
                            asChild
                            className="border-slate-200 hover:bg-slate-50 bg-transparent"
                          >
                            <Link href={`/services/tenders/${tender.id}`}>View Details</Link>
                          </Button>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700"
                          >
                            <Link href={`/services/tenders/${tender.id}`}>Submit Proposal</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="public" className="space-y-6">
              {publicTenders.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-900/20 dark:to-gray-900/20 flex items-center justify-center">
                    <FileText className="h-20 w-20 text-slate-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    No Government Contracts Found
                  </h3>
                  <p className="text-lg text-gray-900 dark:text-white max-w-md mx-auto mb-8">
                    We're partnering with government agencies and public institutions. Please check back later for
                    official tender opportunities!
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {publicTenders.map((tender, index) => (
                    <motion.div
                      key={tender.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border-0 h-full">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="space-y-2 flex-1">
                              <CardTitle className="text-xl font-bold text-slate-700 dark:text-slate-300">
                                {tender.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-gray-900">
                                <Building className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium">{tender.company || "Government Agency"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-900">
                                <MapPin className="h-4 w-4 text-gray-900" />
                                <span className="text-sm">{(tender.town || "Kitale") + ", Kenya"}</span>
                              </div>
                            </div>
                            <Badge className="bg-blue-500 text-white">PUBLIC</Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{tender.description}</p>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-gray-900">Value</span>
                              </div>
                              <p className="font-semibold text-green-600">{(tender as any).value || tender.price || "$1.2M"}</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <span className="text-xs text-gray-900">Deadline</span>
                              </div>
                              <p className="font-semibold text-orange-600">{tender.deadline || "45 days"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                              {tender.category || "Healthcare"}
                            </Badge>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              Public
                            </Badge>
                          </div>
                        </CardContent>

                        <CardFooter className="grid grid-cols-2 gap-3 pt-6">
                          <Button
                            variant="outline"
                            asChild
                            className="border-slate-200 hover:bg-slate-50 bg-transparent"
                          >
                            <Link href={`/services/tenders/${tender.id}`}>View Details</Link>
                          </Button>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700"
                          >
                            <Link href={`/services/tenders/${tender.id}`}>Submit Bid</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Why Choose Our Tender Platform */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-slate-500 to-gray-600 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Verified Opportunities</h3>
            <p className="text-gray-900 leading-relaxed">
              All tenders are verified for authenticity and legitimacy before being listed.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-600 to-zinc-600 flex items-center justify-center">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Smart Matching</h3>
            <p className="text-gray-900 leading-relaxed">
              Get matched with tenders that fit your business profile and capabilities.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-zinc-600 to-slate-600 flex items-center justify-center">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Success Support</h3>
            <p className="text-gray-900 leading-relaxed">
              Expert guidance and proposal writing assistance to maximize your win rate.
            </p>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-400/20 via-gray-400/20 to-slate-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-3xl border border-slate-100 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-600 to-gray-700 bg-clip-text text-transparent">
              Ready to Win Your Next Contract?
            </h3>
            <p className="text-lg text-gray-900 mb-8 max-w-2xl mx-auto">
              Connect with our tender specialists for personalized guidance and proposal support.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                className="h-14 bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 px-8 text-lg"
                asChild
              >
                <a href="tel:+254701524543">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: +254 701 524543
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="h-14 border-slate-200 hover:bg-slate-50 px-8 text-lg"
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
    </div>
  )
}


