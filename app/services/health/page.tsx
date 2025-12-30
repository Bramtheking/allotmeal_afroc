"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  Heart,
  MapPin,
  Phone,
  Loader2,
  Stethoscope,
  Clock,
  Shield,
  Activity,
  Users,
  Search,
  Filter,
  Plus,
  Ambulance,
  Building,
  Pill,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

export default function HealthPage() {
  const [health, setHealth] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          console.log("[v0] Firebase not available")
          setLoading(false)
          return
        }

        console.log("[v0] Fetching health services from Firebase...")
        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "health"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const healthData: Service[] = []

        querySnapshot.forEach((doc) => {
          healthData.push({ id: doc.id, ...doc.data() } as Service)
        })

        console.log("[v0] Successfully fetched health services from database:", healthData.length)
        setHealth(healthData)
      } catch (error) {
        console.error("[v0] Error fetching health services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
  }, [])

  const getHealthByType = (type: string) => {
    // Since marketing dashboard doesn't save healthType field, show all health services
    return health
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-red-950/20 dark:via-gray-950 dark:to-pink-950/20">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <span className="text-lg font-medium bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Loading health services...
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const medicalCampaigns = getHealthByType("campaign")
  const clinics = getHealthByType("clinic")
  const healthPrograms = getHealthByType("program")

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-red-950/20 dark:via-gray-950 dark:to-pink-950/20">
      {/* Hero Section with Search */}
      <div className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 via-pink-400/20 to-rose-500/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
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
              Health &
              <br />
              <span className="bg-gradient-to-r from-red-300 to-pink-300 bg-clip-text text-transparent">
                Medical Care
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Access quality healthcare services, medical professionals, and wellness programs across Africa's leading
              healthcare facilities.
            </p>
          </motion.div>

          {/* Health Search Box */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Service Type</label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                    <select className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-red-400 bg-white">
                      <option value="">All Services</option>
                      <option value="consultation">Consultation</option>
                      <option value="emergency">Emergency</option>
                      <option value="specialist">Specialist</option>
                      <option value="wellness">Wellness</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-500" />
                    <Input placeholder="Enter location" className="pl-10 h-12 border-gray-200 focus:border-pink-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Availability</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-rose-500" />
                    <select className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-rose-400 bg-white">
                      <option value="">Any Time</option>
                      <option value="now">Available Now</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <Button className="flex-1 h-12 text-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Find Healthcare
                </Button>
                <Button variant="outline" className="md:w-auto h-12 border-gray-300 hover:bg-gray-50 bg-transparent">
                  <Filter className="mr-2 h-4 w-4" />
                  Emergency
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-20">
        {/* Featured Health Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Premium Healthcare Services
            </h2>
            <p className="text-xl text-gray-900 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with certified medical professionals and world-class healthcare facilities
            </p>
          </div>

          <Tabs defaultValue="campaign" className="mb-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm border-red-200 shadow-lg">
              <TabsTrigger
                value="campaign"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger
                value="clinic"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                <Building className="h-4 w-4 mr-2" />
                Clinics
              </TabsTrigger>
              <TabsTrigger
                value="program"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                <Heart className="h-4 w-4 mr-2" />
                Programs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="campaign" className="space-y-6">
              {medicalCampaigns.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
                    <Plus className="h-20 w-20 text-red-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Health Campaigns Coming
                  </h3>
                  <p className="text-lg text-gray-900 dark:text-white max-w-md mx-auto mb-8">
                    We're organizing community health initiatives and vaccination campaigns. Public health programs will
                    be available soon!
                  </p>
                  <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-lg px-8 py-3">
                    Join Campaign
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {medicalCampaigns.map((campaign, index) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 h-full">
                        <div className="relative">
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            {campaign.images && campaign.images.length > 0 ? (
                              <img
                                src={
                                  campaign.images[0] ||
                                  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={campaign.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
                                <Plus className="h-20 w-20 text-red-500" />
                              </div>
                            )}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="absolute top-4 right-4">
                            <Badge className="bg-red-500 text-white">Active Campaign</Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-xl font-bold text-red-600 dark:text-red-400">
                                {campaign.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-gray-900">
                                <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span className="text-sm">{(campaign.town || "Kitale") + ", Kenya"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-red-100 text-red-700">
                              Free
                            </Badge>
                            <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                              Community
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                            {campaign.description}
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="text-xs text-gray-900">Schedule</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-gray-900">Beneficiaries</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-red-500" />
                              <span className="text-xs text-gray-900">Health Safety</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-pink-500" />
                              <span className="text-xs text-gray-900">Monitoring</span>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="grid grid-cols-2 gap-3 pt-6">
                          <Button variant="outline" asChild className="border-red-200 hover:bg-red-50 bg-transparent">
                            <Link href={`/services/health/${campaign.id}`}>Learn More</Link>
                          </Button>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                          >
                            <Link href={`/services/health/${campaign.id}`}>Join Campaign</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="clinic" className="space-y-6">
              {clinics.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
                    <Building className="h-20 w-20 text-red-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Premium Clinics Loading
                  </h3>
                  <p className="text-lg text-gray-900 dark:text-white max-w-md mx-auto mb-8">
                    We're connecting with top medical facilities and specialist clinics. Quality healthcare will be
                    accessible soon!
                  </p>
                  <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-lg px-8 py-3">
                    Find Clinics
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {/* Similar card structure for clinics */}
                </div>
              )}
            </TabsContent>

            <TabsContent value="program" className="space-y-6">
              {healthPrograms.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
                    <Heart className="h-20 w-20 text-red-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Wellness Programs Starting
                  </h3>
                  <p className="text-lg text-gray-900 dark:text-white max-w-md mx-auto mb-8">
                    Comprehensive health and wellness programs are being developed. Prevention and care programs will
                    launch soon!
                  </p>
                  <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-lg px-8 py-3">
                    Join Programs
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {/* Similar card structure for programs */}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Why Choose Our Healthcare Platform */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-red-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Certified Professionals</h3>
            <p className="text-gray-900 leading-relaxed">
              All medical professionals are licensed, certified, and continuously trained.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
              <Ambulance className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">24/7 Emergency</h3>
            <p className="text-gray-900 leading-relaxed">
              Round-the-clock emergency services with rapid response times.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-red-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-rose-500 to-red-500 flex items-center justify-center">
              <Pill className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Modern Equipment</h3>
            <p className="text-gray-900 leading-relaxed">
              State-of-the-art medical equipment and advanced diagnostic tools.
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
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-pink-400/20 to-red-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-3xl border border-red-100 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Need Medical Assistance?
            </h3>
            <p className="text-lg text-gray-900 mb-8 max-w-2xl mx-auto">
              Get immediate medical support, book appointments, or connect with healthcare professionals. Available 24/7 for emergencies.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                className="h-14 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-8 text-lg"
                asChild
              >
                <a href="tel:+254701524543">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: +254 701 524543
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="h-14 border-red-200 hover:bg-red-50 px-8 text-lg"
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

