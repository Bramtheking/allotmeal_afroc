"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Phone,
  Loader2,
  Wheat,
  MapPin,
  DollarSign,
  Search,
  Filter,
  Star,
  Sprout,
  Building,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { getMockAgriculture } from "@/lib/mock-data"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function AgriculturePage() {
  const [agriculture, setAgriculture] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [townFilter, setTownFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState("")

  useEffect(() => {
    const fetchAgriculture = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          console.log("Using mock data for agriculture")
          setAgriculture(getMockAgriculture())
          setLoading(false)
          return
        }

        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "agriculture"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const agricultureData: Service[] = []

        querySnapshot.forEach((doc) => {
          agricultureData.push({ id: doc.id, ...doc.data() } as Service)
        })

        console.log("Fetched agriculture services from Firebase:", agricultureData.length)
        setAgriculture(agricultureData.length > 0 ? agricultureData : getMockAgriculture())
      } catch (error) {
        console.error("Error fetching agriculture:", error)
        setAgriculture(getMockAgriculture())
      } finally {
        setLoading(false)
      }
    }

    fetchAgriculture()
  }, [])

  const getFilteredAgriculture = () => {
    let filtered = agriculture

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.town || "Kitale").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by town (assume Kitale if no town specified)
    if (townFilter) {
      filtered = filtered.filter((item) => {
        const itemTown = item.town || "Kitale" // Default to Kitale for old data
        return itemTown.toLowerCase().includes(townFilter.toLowerCase())
      })
    }

    // Filter by price range
    if (priceFilter) {
      // Simple price filtering - can be enhanced based on actual price format
      filtered = filtered.filter((item) => {
        if (!item.price) return false
        const price = item.price.toLowerCase()
        switch (priceFilter) {
          case "0-1000":
            return price.includes("0") || price.includes("500") || price.includes("1000")
          case "1000-5000":
            return (
              price.includes("1000") ||
              price.includes("2000") ||
              price.includes("3000") ||
              price.includes("4000") ||
              price.includes("5000")
            )
          case "5000+":
            return price.includes("5000") || price.includes("10000") || price.includes("15000")
          default:
            return true
        }
      })
    }

    return filtered
  }

  const getAgricultureByCategory = (category: string) => {
    const filtered = getFilteredAgriculture()
    return filtered.filter((item) => item.category?.toLowerCase() === category.toLowerCase())
  }

  const handleSearch = () => {
    // Search is handled automatically through state updates
    console.log("Searching with:", { searchTerm, townFilter, priceFilter })
  }

  // Kenyan towns list (alphabetically sorted)
  const kenyanTowns = [
    "Bungoma", "Eldoret", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kakamega", "Kericho",
    "Kilifi", "Kisii", "Kisumu", "Kitale", "Kitui", "Lamu", "Lodwar", "Machakos",
    "Malindi", "Mandera", "Meru", "Migori", "Mombasa", "Mumias", "Nairobi", "Naivasha",
    "Nakuru", "Nanyuki", "Narok", "Nyeri", "Thika", "Voi", "Wajir", "Webuye"
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50 dark:from-green-950/20 dark:via-gray-950 dark:to-lime-950/20">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-lime-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <span className="text-lg font-medium bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
                Loading agriculture services...
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const animals = getAgricultureByCategory("animals")
  const products = getAgricultureByCategory("products")
  const structures = getAgricultureByCategory("structures")
  const allFiltered = getFilteredAgriculture()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50 dark:from-green-950/20 dark:via-gray-950 dark:to-lime-950/20">
      {/* Hero Section with Search */}
      <div className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 via-lime-400/20 to-emerald-500/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
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
              Agriculture &
              <br />
              <span className="bg-gradient-to-r from-green-300 to-lime-300 bg-clip-text text-transparent">
                Farming Excellence
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Connect with premium livestock, fresh produce, and agricultural innovations across Africa's most fertile
              regions.
            </p>
          </motion.div>

          {/* Agriculture Search Box */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Search Products</label>
                  <div className="relative">
                    <Wheat className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    <Input
                      placeholder="Search agriculture services..."
                      className="pl-10 h-12 border-gray-200 focus:border-green-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Town</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-lime-500 z-10" />
                    <select
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-lime-400 bg-white text-gray-900"
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
                  <label className="text-sm font-semibold text-gray-700">Price Range</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
                    <select
                      className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-emerald-400 bg-white text-gray-900"
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                    >
                      <option value="" className="text-gray-900">Any Price</option>
                      <option value="0-1000" className="text-gray-900">$0 - $1,000</option>
                      <option value="1000-5000" className="text-gray-900">$1,000 - $5,000</option>
                      <option value="5000+" className="text-gray-900">$5,000+</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <Button
                  className="flex-1 h-12 text-lg bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 shadow-lg"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Agriculture
                </Button>
                <Button
                  variant="outline"
                  className="md:w-auto h-12 border-gray-300 hover:bg-gray-50 bg-transparent"
                  onClick={() => {
                    setSearchTerm("")
                    setTownFilter("")
                    setPriceFilter("")
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-20">
        {/* Search Results Summary */}
        {(searchTerm || townFilter || priceFilter) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Search Results</h3>
                  <p className="text-gray-600">Found {allFiltered.length} agriculture services</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setTownFilter("")
                    setPriceFilter("")
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
              {(searchTerm || townFilter || priceFilter) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {searchTerm && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                  {townFilter && (
                    <Badge variant="secondary" className="bg-lime-100 text-lime-700">
                      Town: "{townFilter}"
                    </Badge>
                  )}
                  {priceFilter && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Price:{" "}
                      {priceFilter === "0-1000"
                        ? "$0-$1,000"
                        : priceFilter === "1000-5000"
                          ? "$1,000-$5,000"
                          : "$5,000+"}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Featured Agriculture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
              Premium Agricultural Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From sustainable farming solutions to premium livestock breeding programs
            </p>
          </div>

          <Tabs defaultValue="all" className="mb-12">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-lime-500 data-[state=active]:text-white"
              >
                All ({allFiltered.length})
              </TabsTrigger>
              <TabsTrigger
                value="animals"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-lime-500 data-[state=active]:text-white"
              >
                Livestock ({animals.length})
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-lime-500 data-[state=active]:text-white"
              >
                Products ({products.length})
              </TabsTrigger>
              <TabsTrigger
                value="structures"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-lime-500 data-[state=active]:text-white"
              >
                Equipment ({structures.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {allFiltered.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-green-100 to-lime-100 dark:from-green-900/20 dark:to-lime-900/20 flex items-center justify-center">
                    <Wheat className="h-20 w-20 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    No Agriculture Services Found
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    {searchTerm || townFilter || priceFilter
                      ? "Try adjusting your search filters to find more results."
                      : "We're connecting with agricultural service providers. Check back soon for farming opportunities!"}
                  </p>
                  <Button
                    className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-lg px-8 py-3"
                    onClick={() => {
                      setSearchTerm("")
                      setTownFilter("")
                      setPriceFilter("")
                    }}
                  >
                    {searchTerm || townFilter || priceFilter ? "Clear Filters" : "Get Notified"}
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {allFiltered.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 h-full">
                        <div className="relative">
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            {service.images && service.images.length > 0 ? (
                              <img
                                src={
                                  service.images[0] ||
                                  "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80"
                                }
                                alt={service.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-green-100 to-lime-100 dark:from-green-900/20 dark:to-lime-900/20 flex items-center justify-center">
                                <Wheat className="h-20 w-20 text-green-500" />
                              </div>
                            )}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="absolute top-4 right-4">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-green-400 text-green-400" />
                                <span className="font-bold text-gray-800">{service.rating || "4.9"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pb-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-xl font-bold group-hover:text-green-600 transition-colors duration-300">
                                {service.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{service.town || "Kitale"}, Kenya</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {service.category || "Agriculture"}
                            </Badge>
                            <Badge variant="secondary" className="bg-lime-100 text-lime-700">
                              {service.status === "active" ? "Available" : "Pending"}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{service.description}</p>

                          <div className="flex items-end justify-between pt-4 border-t">
                            <div>
                              <p className="text-xs text-gray-500">Starting from</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
                                  {service.price || "Contact for price"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-green-600 font-medium">Quality Assured</p>
                              <p className="text-xs text-gray-500">Verified provider</p>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="grid grid-cols-2 gap-3 pt-6">
                          <Button
                            variant="outline"
                            asChild
                            className="border-green-200 hover:bg-green-50 bg-transparent"
                          >
                            <Link href={`/services/agriculture/${service.id}`}>View Details</Link>
                          </Button>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600"
                          >
                            <Link href={`/services/agriculture/${service.id}`}>Contact Provider</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Similar structure for other tabs but showing filtered results */}
            <TabsContent value="animals" className="space-y-6">
              {animals.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-green-100 to-lime-100 dark:from-green-900/20 dark:to-lime-900/20 flex items-center justify-center">
                    <Sprout className="h-20 w-20 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">No Livestock Found</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    {searchTerm || townFilter || priceFilter
                      ? "Try adjusting your search filters to find livestock."
                      : "We're connecting with livestock breeders. Check back soon!"}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {animals.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {/* Same card structure as above */}
                      <Card className="group overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 h-full">
                        {/* Card content similar to above */}
                        <div className="relative">
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            {service.images && service.images.length > 0 ? (
                              <img
                                src={service.images[0] || "/placeholder.svg"}
                                alt={service.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-green-100 to-lime-100 flex items-center justify-center">
                                <Sprout className="h-20 w-20 text-green-500" />
                              </div>
                            )}
                          </div>
                        </div>
                        <CardHeader className="pb-4">
                          <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{service.town || "Kitale"}, Kenya</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                        </CardContent>
                        <CardFooter className="grid grid-cols-2 gap-3">
                          <Button variant="outline" asChild>
                            <Link href={`/services/agriculture/${service.id}`}>View Details</Link>
                          </Button>
                          <Button asChild className="bg-gradient-to-r from-green-500 to-lime-500">
                            <Link href={`/services/agriculture/${service.id}`}>Contact</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Products and Structures tabs with similar structure */}
            <TabsContent value="products" className="space-y-6">
              {products.length === 0 ? (
                <motion.div className="text-center py-20">
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-green-100 to-lime-100 flex items-center justify-center">
                    <Sprout className="h-20 w-20 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4">No Products Found</h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
                    {searchTerm || townFilter || priceFilter
                      ? "Try adjusting your search filters."
                      : "Fresh agricultural products coming soon!"}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {products.map((service, index) => (
                    <Card
                      key={service.id}
                      className="group overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 h-full"
                    >
                      <CardHeader>
                        <CardTitle>{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </CardContent>
                      <CardFooter className="grid grid-cols-2 gap-3">
                        <Button variant="outline" asChild>
                          <Link href={`/services/agriculture/${service.id}`}>View Details</Link>
                        </Button>
                        <Button asChild className="bg-gradient-to-r from-green-500 to-lime-500">
                          <Link href={`/services/agriculture/${service.id}`}>Order Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="structures" className="space-y-6">
              {structures.length === 0 ? (
                <motion.div className="text-center py-20">
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-green-100 to-lime-100 flex items-center justify-center">
                    <Building className="h-20 w-20 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4">No Equipment Found</h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
                    {searchTerm || townFilter || priceFilter
                      ? "Try adjusting your search filters."
                      : "Agricultural equipment solutions coming soon!"}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {structures.map((service, index) => (
                    <Card
                      key={service.id}
                      className="group overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 h-full"
                    >
                      <CardHeader>
                        <CardTitle>{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </CardContent>
                      <CardFooter className="grid grid-cols-2 gap-3">
                        <Button variant="outline" asChild>
                          <Link href={`/services/agriculture/${service.id}`}>Learn More</Link>
                        </Button>
                        <Button asChild className="bg-gradient-to-r from-green-500 to-lime-500">
                          <Link href={`/services/agriculture/${service.id}`}>Get Quote</Link>
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
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-lime-400/20 to-green-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-3xl border border-green-100 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
              Connect With Agricultural Experts
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get personalized advice, farming solutions, and connect with verified agricultural service providers in
              your area. Our team is available 24/7 to assist you.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                className="h-14 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 px-8 text-lg"
                asChild
              >
                <a href="tel:+254701524543">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: +254 701 524543
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="h-14 border-green-200 hover:bg-green-50 px-8 text-lg"
                asChild
              >
                <a href="mailto:allotmealafrockenya@gmail.com">
                  ✉️ Email Support
                </a>
              </Button>
              <Button 
                className="h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-8 text-lg"
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
