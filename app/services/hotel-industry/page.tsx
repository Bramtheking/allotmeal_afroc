"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Star, Loader2, Building2, MapPin, Clock, Users, Wifi, Video, Car, Coffee, Dumbbell, Waves, CalendarDays, Search, Filter, Heart, Check, Bath, Bed, Utensils, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { getMockHotels } from "@/lib/mock-data"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// African countries list
const kenyanTowns = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon",
  "Central African Republic", "Chad", "Comoros", "Congo", "Côte d'Ivoire", "Democratic Republic of the Congo",
  "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia",
  "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar",
  "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger",
  "Nigeria", "Rwanda", "São Tomé and Príncipe", "Senegal", "Seychelles", "Sierra Leone", "Somalia",
  "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
]

export default function HotelIndustryPage() {
  const [hotels, setHotels] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [townFilter, setTownFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "mid" | "luxury">("all")

  // Kenyan towns list (alphabetically sorted)
  const kenyanTowns = [
    "Bungoma", "Eldoret", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kakamega", "Kericho",
    "Kilifi", "Kisii", "Kisumu", "Kitale", "Kitui", "Lamu", "Lodwar", "Machakos",
    "Malindi", "Mandera", "Meru", "Migori", "Mombasa", "Mumias", "Nairobi", "Naivasha",
    "Nakuru", "Nanyuki", "Narok", "Nyeri", "Thika", "Voi", "Wajir", "Webuye"
  ]
  const [sortBy, setSortBy] = useState<"newest" | "a-z" | "z-a" | "price-low" | "price-high">("newest")

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          // Use mock data when Firebase is not available
          console.log("Using mock data for hotels")
          setHotels(getMockHotels())
          setLoading(false)
          return
        }

        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "hotel-industry"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const hotelData: Service[] = []

        querySnapshot.forEach((doc) => {
          hotelData.push({ id: doc.id, ...doc.data() } as Service)
        })

        setHotels(hotelData)
      } catch (error) {
        console.error("Error fetching hotels:", error)
        // Fallback to mock data on error
        setHotels(getMockHotels())
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [])

  const getFilteredHotels = () => {
    let filtered = hotels

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (hotel) =>
          hotel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (hotel.town || "Kitale").toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by town (assume Kitale if no town specified)
    if (townFilter) {
      filtered = filtered.filter((hotel) => {
        const hotelTown = hotel.town || "Kitale" // Default to Kitale for old data
        return hotelTown.toLowerCase().includes(townFilter.toLowerCase())
      })
    }

    // Filter by price range
    if (priceFilter !== "all") {
      filtered = filtered.filter((hotel) => {
        const priceStr = hotel.price?.toLowerCase() || ""
        if (priceFilter === "budget") {
          return priceStr.includes("budget") || priceStr.includes("affordable") || priceStr.includes("ksh") && parseInt(priceStr) < 5000
        }
        if (priceFilter === "mid") {
          return priceStr.includes("mid") || priceStr.includes("moderate") || (priceStr.includes("ksh") && parseInt(priceStr) >= 5000 && parseInt(priceStr) < 15000)
        }
        if (priceFilter === "luxury") {
          return priceStr.includes("luxury") || priceStr.includes("premium") || (priceStr.includes("ksh") && parseInt(priceStr) >= 15000)
        }
        return true
      })
    }

    // Sort
    if (sortBy === "a-z") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === "z-a") {
      filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title))
    } else if (sortBy === "price-low" || sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => {
        const priceA = parseInt(a.price?.replace(/\D/g, "") || "0")
        const priceB = parseInt(b.price?.replace(/\D/g, "") || "0")
        return sortBy === "price-low" ? priceA - priceB : priceB - priceA
      })
    }

    return filtered
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-amber-950/20 dark:via-gray-950 dark:to-blue-950/20">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-blue-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <span className="text-lg font-medium bg-gradient-to-r from-amber-600 to-blue-600 bg-clip-text text-transparent">
                Loading hotels...
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-amber-950/20 dark:via-gray-950 dark:to-blue-950/20">
      {/* Hero Section with Search */}
      <div className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 via-orange-400/20 to-blue-500/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        <div className="container relative py-20">
          <motion.div 
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button variant="outline" size="icon" asChild className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30">
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
              Discover Africa's
              <br />
              <span className="bg-gradient-to-r from-amber-300 to-blue-300 bg-clip-text text-transparent">
                Finest Hotels
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              From luxury resorts to boutique getaways, find your perfect accommodation 
              across Africa's most stunning destinations.
            </p>
          </motion.div>

          {/* Hotel Search Box */}
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Hotel Name or Keywords</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500" />
                    <Input 
                      placeholder="Search hotels..." 
                      className="pl-10 h-12 border-gray-200 focus:border-amber-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Location (town)</label>
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
                  <label className="text-sm font-semibold text-gray-700">Price Range</label>
                  <select
                    className="w-full h-12 border border-gray-200 rounded-lg focus:border-amber-400 bg-white text-gray-900 px-4"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value as "all" | "budget" | "mid" | "luxury")}
                  >
                    <option value="all" className="text-gray-900">All Prices</option>
                    <option value="budget" className="text-gray-900">Budget (Under KSh 5,000)</option>
                    <option value="mid" className="text-gray-900">Mid-Range (KSh 5,000 - 15,000)</option>
                    <option value="luxury" className="text-gray-900">Luxury (KSh 15,000+)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Sort By</label>
                  <select
                    className="w-full h-12 border border-gray-200 rounded-lg focus:border-amber-400 bg-white text-gray-900 px-4"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "newest" | "a-z" | "z-a" | "price-low" | "price-high")}
                  >
                    <option value="newest" className="text-gray-900">Newest First</option>
                    <option value="a-z" className="text-gray-900">Name: A to Z</option>
                    <option value="z-a" className="text-gray-900">Name: Z to A</option>
                    <option value="price-low" className="text-gray-900">Price: Low to High</option>
                    <option value="price-high" className="text-gray-900">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 flex items-center justify-center">
                  Showing {getFilteredHotels().length} of {hotels.length} hotels
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <Button className="flex-1 h-12 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Search Hotels
                </Button>
                <Button 
                  variant="outline" 
                  className="md:w-auto h-12 border-gray-300 hover:bg-gray-50 bg-transparent"
                  onClick={() => {
                    setSearchTerm("")
                    setTownFilter("")
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
        {/* Featured Hotels Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-blue-600 bg-clip-text text-transparent">
              Featured Accommodations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Handpicked luxury hotels and unique stays across Africa's most desirable destinations
            </p>
          </div>

          {getFilteredHotels().length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-amber-100 to-blue-100 dark:from-amber-900/20 dark:to-blue-900/20 flex items-center justify-center">
                <Building2 className="h-20 w-20 text-amber-500" />
              </div>
              <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Exciting Hotels Coming Soon
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                We're curating an amazing selection of luxury accommodations for you. 
                Check back soon for exclusive deals!
              </p>
              <Button className="bg-gradient-to-r from-amber-500 to-blue-500 hover:from-amber-600 hover:to-blue-600 text-lg px-8 py-3">
                Notify Me When Available
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {getFilteredHotels().map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 h-full">
                    <div className="relative">
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        {hotel.images && hotel.images.length > 0 ? (
                          <img
                            src={hotel.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
                            alt={hotel.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-blue-100 dark:from-amber-900/20 dark:to-blue-900/20 flex items-center justify-center">
                            <Building2 className="h-20 w-20 text-amber-500" />
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Hotel Rating */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-gray-800">{hotel.rating || "4.8"}</span>
                            <span className="text-xs text-gray-600">(127)</span>
                          </div>
                        </div>
                      </div>

                      {/* Favorite Button */}
                      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0">
                          <Heart className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-amber-600 transition-colors duration-300">
                            {hotel.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <MapPin className="h-4 w-4 text-amber-500 flex-shrink-0" />
                            <span className="text-sm font-medium">{hotel.town || "Kitale"}, Kenya</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Free Cancellation
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          Instant Booking
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 font-medium">{hotel.description}</p>
                      
                      {/* Room Features */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Bed className="h-4 w-4 text-blue-500" />
                          <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">King Bed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="h-4 w-4 text-blue-500" />
                          <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">Private Bath</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">Free WiFi</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-amber-500" />
                          <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">Restaurant</span>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                          <Waves className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">Pool</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                          <Dumbbell className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">Gym</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                          <Car className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">Parking</span>
                        </div>
                      </div>
                      
                      {/* Price */}
                      {hotel.price && (
                        <div className="flex items-end justify-between pt-4 border-t">
                          <div>
                            <p className="text-xs text-gray-500">From</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-blue-600 bg-clip-text text-transparent">
                                {hotel.price}
                              </span>
                              <span className="text-sm text-gray-500">/ night</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-green-600 font-medium">Great Value</p>
                            <p className="text-xs text-gray-500">Incl. taxes & fees</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="grid grid-cols-2 gap-3 pt-6">
                      <Button variant="outline" asChild className="border-amber-200 hover:bg-amber-50">
                        <Link href={`/services/hotel-industry/${hotel.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button asChild className="bg-gradient-to-r from-amber-500 to-blue-500 hover:from-amber-600 hover:to-blue-600">
                        <Link href={`/services/hotel-industry/${hotel.id}`}>
                          Book Now
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Why Choose Us Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-amber-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Best Price Guarantee</h3>
            <p className="text-gray-600 leading-relaxed">Find the same room cheaper? We'll match the price and give you an extra 10% off.</p>
          </div>
          
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-blue-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Instant Confirmation</h3>
            <p className="text-gray-600 leading-relaxed">Book with confidence. Receive instant confirmation for all your reservations.</p>
          </div>
          
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-amber-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">24/7 Support</h3>
            <p className="text-gray-600 leading-relaxed mb-4">Our travel experts are available around the clock to help with your bookings.</p>
            <div className="space-y-2">
              <a href="tel:+254701524543" className="block text-amber-600 hover:text-amber-700 font-semibold">
                📞 +254 701 524543
              </a>
              <a href="mailto:allotmealafrockenya@gmail.com" className="block text-amber-600 hover:text-amber-700 font-semibold text-sm">
                ✉️ allotmealafrockenya@gmail.com
              </a>
            </div>
          </div>
        </motion.div>

        {/* Popular Destinations */}
        <motion.div 
          className="relative mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Explore Africa's most captivating locations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Cape Town", "Nairobi", "Lagos", "Marrakech", "Cairo", "Accra", "Dar es Salaam", "Johannesburg"].map((city, index) => (
              <motion.div
                key={city}
                className="relative overflow-hidden rounded-2xl aspect-[3/2] group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/80 to-blue-600/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg">{city}</h3>
                  <p className="text-white/80 text-sm">125+ hotels</p>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-blue-400/20 to-amber-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-3xl border border-amber-100 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-blue-600 bg-clip-text text-transparent">
              Get Exclusive Hotel Deals
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about special offers, new hotels, and exclusive discounts.
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email address" 
                className="flex-1 h-12 border-gray-200"
              />
              <Button className="h-12 bg-gradient-to-r from-amber-500 to-blue-500 hover:from-amber-600 hover:to-blue-600 px-8">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              No spam, unsubscribe at any time. Read our privacy policy.
            </p>
          </div>
        </motion.div>

        {/* Footer Navigation */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16 pt-8 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Button variant="outline" asChild className="border-amber-200 hover:bg-amber-50">
            <Link href="/#services">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
            </Link>
          </Button>
          <div className="flex flex-col md:flex-row gap-4">
            <Button 
              variant="outline" 
              className="border-blue-200 hover:bg-blue-50 h-14 text-lg"
              asChild
            >
              <a href="tel:+254701524543">
                <Phone className="mr-2 h-5 w-5" /> Call: +254 701 524543
              </a>
            </Button>
            <Button 
              variant="outline" 
              className="border-amber-200 hover:bg-amber-50 h-14 text-lg"
              asChild
            >
              <a href="mailto:allotmealafrockenya@gmail.com">
                ✉️ Email Support
              </a>
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-14 text-lg"
              asChild
            >
              <a href="https://wa.me/254701524543" target="_blank" rel="noopener noreferrer">
                💬 WhatsApp Live Chat
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


