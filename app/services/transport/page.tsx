"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Plane,
  Ship,
  Truck,
  Loader2,
  Route,
  DollarSign,
  Users,
  Zap,
  Search,
  Filter,
  Star,
  Globe,
  Timer,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

export default function TransportPage() {
  const [transport, setTransport] = useState<Service[]>([])
  const [filteredTransport, setFilteredTransport] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [townFilter, setTownFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState("")

  // Kenyan towns list (alphabetically sorted)
  const kenyanTowns = [
    "Bungoma", "Eldoret", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kakamega", "Kericho",
    "Kilifi", "Kisii", "Kisumu", "Kitale", "Kitui", "Lamu", "Lodwar", "Machakos",
    "Malindi", "Mandera", "Meru", "Migori", "Mombasa", "Mumias", "Nairobi", "Naivasha",
    "Nakuru", "Nanyuki", "Narok", "Nyeri", "Thika", "Voi", "Wajir", "Webuye"
  ]
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          console.log("[v0] Firebase not available")
          setLoading(false)
          return
        }

        console.log("[v0] Fetching transport services from Firebase...")
        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "transport"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const transportData: Service[] = []

        querySnapshot.forEach((doc) => {
          transportData.push({ id: doc.id, ...doc.data() } as Service)
        })

        console.log("[v0] Successfully fetched transport services from database:", transportData.length)
        setTransport(transportData)
        setFilteredTransport(transportData)
      } catch (error) {
        console.error("[v0] Error fetching transport services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransport()
  }, [])

  useEffect(() => {
    let filtered = transport

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.town || "Kitale").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Town filter (assume Kitale if no town specified)
    if (townFilter) {
      filtered = filtered.filter((item) => {
        const itemTown = item.town || "Kitale" // Default to Kitale for old data
        return itemTown.toLowerCase().includes(townFilter.toLowerCase())
      })
    }

    // Price filter
    if (priceFilter) {
      filtered = filtered.filter((item) => {
        const price = Number.parseFloat(item.price?.replace(/[^0-9.]/g, "") || "0")
        switch (priceFilter) {
          case "0-50":
            return price <= 50
          case "50-200":
            return price > 50 && price <= 200
          case "200+":
            return price > 200
          default:
            return true
        }
      })
    }

    setFilteredTransport(filtered)
  }, [transport, searchTerm, townFilter, priceFilter])

  const getTransportByType = (type: string) => {
    // Since marketing dashboard doesn't save transportType field, show all transport
    return filteredTransport
  }

  const clearFilters = () => {
    setSearchTerm("")
    setTownFilter("")
    setPriceFilter("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-sky-950/20 dark:via-gray-950 dark:to-indigo-950/20">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <span className="text-lg font-medium bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                Loading transport services...
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const roadTransport = getTransportByType("road")
  const airTransport = getTransportByType("air")
  const oceanTransport = getTransportByType("ocean")

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-sky-950/20 dark:via-gray-950 dark:to-indigo-950/20">
      {/* Hero Section with Transport Search */}
      <div className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/30 via-blue-400/20 to-indigo-500/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
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
              Transport &
              <br />
              <span className="bg-gradient-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Logistics Solutions
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Connect the continent with reliable transport services, logistics solutions, and shipping options across
              Africa and beyond.
            </p>
          </motion.div>

          {/* Transport Search Box */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Search Transport</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sky-500" />
                    <Input
                      placeholder="Search routes, companies..."
                      className="pl-10 h-12 border-gray-200 focus:border-sky-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                    <Input
                      placeholder="Select town"
                      className="pl-10 h-12 border border-gray-200 focus:border-blue-400"
                      value={townFilter}
                      onChange={(e) => setTownFilter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Price Range</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-500" />
                    <select
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-indigo-400 bg-white text-gray-900"
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                    >
                      <option value="" className="text-gray-900">Any Price</option>
                      <option value="0-50" className="text-gray-900">$0 - $50</option>
                      <option value="50-200" className="text-gray-900">$50 - $200</option>
                      <option value="200+" className="text-gray-900">$200+</option>
                    </select>
                  </div>
                </div>
              </div>

              {(searchTerm || townFilter || priceFilter) && (
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Found {filteredTransport.length} transport service{filteredTransport.length !== 1 ? "s" : ""}
                    {searchTerm && ` matching "${searchTerm}"`}
                  </span>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <Button className="flex-1 h-12 text-lg bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 shadow-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Find Transport
                </Button>
                <Button variant="outline" className="md:w-auto h-12 border-gray-300 hover:bg-gray-50 bg-transparent">
                  <Filter className="mr-2 h-4 w-4" />
                  More Options
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-20">
        {/* Featured Transport Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Premium Transport Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Reliable, efficient, and safe transport services connecting Africa to the world
            </p>
          </div>

          <Tabs defaultValue="road" className="mb-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm border-sky-200 shadow-lg">
              <TabsTrigger
                value="road"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <Truck className="h-4 w-4 mr-2" />
                Road
              </TabsTrigger>
              <TabsTrigger
                value="air"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <Plane className="h-4 w-4 mr-2" />
                Air
              </TabsTrigger>
              <TabsTrigger
                value="ocean"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <Ship className="h-4 w-4 mr-2" />
                Ocean
              </TabsTrigger>
            </TabsList>

            <TabsContent value="road" className="space-y-6">
              {roadTransport.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <Truck className="h-20 w-20 text-sky-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Road Transport Networks Loading
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    We're connecting with Africa's leading logistics companies and transport operators. Comprehensive
                    road transport services launching soon!
                  </p>
                  <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-lg px-8 py-3">
                    Join Waiting List
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {roadTransport.map((route, index) => (
                    <motion.div
                      key={route.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border-0 h-full">
                        <div className="relative">
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            {route.images && route.images.length > 0 ? (
                              <img
                                src={
                                  route.images[0] ||
                                  "/placeholder.svg?height=300&width=400&query=transport+vehicle" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={route.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                                <Truck className="h-20 w-20 text-sky-500" />
                              </div>
                            )}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="absolute top-4 right-4">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-sky-400 text-sky-400" />
                                <span className="font-bold text-gray-800">{route.rating || "4.6"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pb-4">
                          <CardTitle className="text-xl font-bold group-hover:text-sky-600 transition-colors duration-300">
                            {route.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Route className="h-4 w-4 text-sky-500" />
                            <span className="text-sm">{route.route || "City to City"}</span>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{route.description}</p>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-gray-600">{route.duration || "4 hours"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="text-xs text-gray-600">{route.capacity || "50 seats"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-emerald-500" />
                              <span className="text-xs text-gray-600">{route.price || "$25"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-purple-500" />
                              <span className="text-xs text-gray-600">Daily</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-sky-100 text-sky-700">
                              Express
                            </Badge>
                            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                              Air-Con
                            </Badge>
                          </div>
                        </CardContent>

                        <CardFooter className="grid grid-cols-2 gap-3 pt-6">
                          <Button variant="outline" asChild className="border-sky-200 hover:bg-sky-50 bg-transparent">
                            <Link href={`/services/transport/${route.id}`}>View Schedule</Link>
                          </Button>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
                          >
                            <Link href={`/services/transport/${route.id}`}>Book Now</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="air" className="space-y-6">
              {airTransport.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <Plane className="h-20 w-20 text-sky-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Flight Services Connecting Soon
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    We're partnering with airlines to offer competitive flight booking and air cargo services. Sky-high
                    convenience coming soon!
                  </p>
                  <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-lg px-8 py-3">
                    Get Flight Alerts
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {airTransport.map((route, index) => (
                    <motion.div
                      key={route.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border-0 h-full">
                        <div className="relative">
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            {route.images && route.images.length > 0 ? (
                              <img
                                src={
                                  route.images[0] ||
                                  "/placeholder.svg?height=300&width=400&query=transport+vehicle" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={route.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                                <Plane className="h-20 w-20 text-sky-500" />
                              </div>
                            )}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="absolute top-4 right-4">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-sky-400 text-sky-400" />
                                <span className="font-bold text-gray-800">{route.rating || "4.7"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pb-4">
                          <CardTitle className="text-xl font-bold group-hover:text-sky-600 transition-colors duration-300">
                            {route.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Route className="h-4 w-4 text-sky-500" />
                            <span className="text-sm">{route.route || "City A to City B"}</span>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{route.description}</p>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-gray-600">{route.duration || "2 hours"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="text-xs text-gray-600">{route.capacity || "150 seats"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-emerald-500" />
                              <span className="text-xs text-gray-600">{route.price || "$100"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-purple-500" />
                              <span className="text-xs text-gray-600">Daily</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-sky-100 text-sky-700">
                              Express
                            </Badge>
                            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                              Air-Con
                            </Badge>
                          </div>
                        </CardContent>

                        <CardFooter className="grid grid-cols-2 gap-3 pt-6">
                          <Button variant="outline" asChild className="border-sky-200 hover:bg-sky-50 bg-transparent">
                            <Link href={`/services/transport/${route.id}`}>View Schedule</Link>
                          </Button>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
                          >
                            <Link href={`/services/transport/${route.id}`}>Book Now</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="ocean" className="space-y-6">
              {oceanTransport.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <Ship className="h-20 w-20 text-sky-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Ocean Freight Solutions Loading
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    Cost-effective ocean freight and shipping solutions are being organized. International cargo
                    services launching soon!
                  </p>
                  <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-lg px-8 py-3">
                    Request Quote
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {oceanTransport.map((route, index) => (
                    <motion.div
                      key={route.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border-0 h-full">
                        <div className="relative">
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            {route.images && route.images.length > 0 ? (
                              <img
                                src={
                                  route.images[0] ||
                                  "/placeholder.svg?height=300&width=400&query=transport+vehicle" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={route.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                                <Ship className="h-20 w-20 text-sky-500" />
                              </div>
                            )}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="absolute top-4 right-4">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-sky-400 text-sky-400" />
                                <span className="font-bold text-gray-800">{route.rating || "4.8"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pb-4">
                          <CardTitle className="text-xl font-bold group-hover:text-sky-600 transition-colors duration-300">
                            {route.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Route className="h-4 w-4 text-sky-500" />
                            <span className="text-sm">{route.route || "Port A to Port B"}</span>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{route.description}</p>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-gray-600">{route.duration || "7 days"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="text-xs text-gray-600">{route.capacity || "1000 tons"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-emerald-500" />
                              <span className="text-xs text-gray-600">{route.price || "$500"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-purple-500" />
                              <span className="text-xs text-gray-600">Daily</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-sky-100 text-sky-700">
                              Express
                            </Badge>
                            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                              Air-Con
                            </Badge>
                          </div>
                        </CardContent>

                        <CardFooter className="grid grid-cols-2 gap-3 pt-6">
                          <Button variant="outline" asChild className="border-sky-200 hover:bg-sky-50 bg-transparent">
                            <Link href={`/services/transport/${route.id}`}>View Schedule</Link>
                          </Button>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
                          >
                            <Link href={`/services/transport/${route.id}`}>Book Now</Link>
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

        {/* Why Choose Our Transport Platform */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-sky-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Wide Network</h3>
            <p className="text-gray-600 leading-relaxed">
              Extensive transport network connecting major cities and remote areas across Africa.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-indigo-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center">
              <Timer className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">On-Time Performance</h3>
            <p className="text-gray-600 leading-relaxed">
              Reliable scheduling with real-time tracking and notifications for your journey.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-sky-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Modern Fleet</h3>
            <p className="text-gray-600 leading-relaxed">
              Contemporary vehicles and vessels equipped with safety features and comfort amenities.
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
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 via-indigo-400/20 to-sky-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-3xl border border-sky-100 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Book your transport or get personalized assistance for logistics and travel planning.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                className="h-14 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 px-8 text-lg"
                asChild
              >
                <a href="tel:+254701524543">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: +254 701 524543
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="h-14 border-sky-200 hover:bg-sky-50 px-8 text-lg"
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



