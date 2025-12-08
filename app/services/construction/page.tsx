"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Building,
  MapPin,
  Phone,
  Hammer,
  Truck,
  Loader2,
  Calendar,
  Users,
  DollarSign,
  Search,
  Filter,
  Star,
  HardHat,
  ShieldCheck,
  Award,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

export default function ConstructionPage() {
  const [construction, setConstruction] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConstruction = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          console.log("[v0] Firebase not available - no construction data will be shown")
          setConstruction([])
          setLoading(false)
          return
        }

        console.log("[v0] Fetching construction services from Firebase...")
        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "construction"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const constructionData: Service[] = []

        querySnapshot.forEach((doc) => {
          constructionData.push({ id: doc.id, ...doc.data() } as Service)
        })

        console.log("[v0] Successfully fetched construction services from database:", constructionData.length)
        console.log("[v0] Construction services data:", constructionData)
        setConstruction(constructionData)
      } catch (error) {
        console.error("[v0] Error fetching construction services:", error)
        setConstruction([])
      } finally {
        setLoading(false)
      }
    }

    fetchConstruction()
  }, [])

  const getConstructionByCategory = (category: string) => {
    const filtered = construction.filter((item) => item.category?.toLowerCase() === category.toLowerCase())
    console.log(`[v0] Construction services for category "${category}":`, filtered.length)
    return filtered
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-red-950/20">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <span className="text-lg font-medium bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Loading construction services...
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const buildingSites = getConstructionByCategory("buildings")
  const roadProjects = getConstructionByCategory("road")
  const constructionMaterials = getConstructionByCategory("materials")

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-red-950/20">
      {/* Hero Section with Search */}
      <div className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 via-red-400/20 to-amber-500/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
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
              Construction &
              <br />
              <span className="bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                Infrastructure
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Build the future with trusted construction professionals, premium materials, and innovative infrastructure
              solutions across Africa.
            </p>
          </motion.div>

          {/* Construction Search Box */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Project Type</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
                    <select className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-orange-400 bg-white">
                      <option value="">All Projects</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="renovation">Renovation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                    <Input placeholder="Enter location" className="pl-10 h-12 border-gray-200 focus:border-red-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Budget Range</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500" />
                    <select className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-amber-400 bg-white">
                      <option value="">Any Budget</option>
                      <option value="0-50000">$0 - $50K</option>
                      <option value="50000-200000">$50K - $200K</option>
                      <option value="200000+">$200K+</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <Button className="flex-1 h-12 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Find Contractors
                </Button>
                <Button variant="outline" className="md:w-auto h-12 border-gray-300 hover:bg-gray-50 bg-transparent">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-20">
        {/* Featured Construction Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Professional Construction Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with certified contractors, architects, and construction specialists
            </p>
          </div>

          <Tabs defaultValue="buildings" className="mb-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
              <TabsTrigger
                value="buildings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
              >
                <Building className="h-4 w-4 mr-2" />
                Buildings
              </TabsTrigger>
              <TabsTrigger
                value="road"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
              >
                <Truck className="h-4 w-4 mr-2" />
                Roads
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
              >
                <Hammer className="h-4 w-4 mr-2" />
                Materials
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buildings" className="space-y-6">
              {buildingSites.length === 0 && construction.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {construction.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 h-full">
                        <div className="relative">
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            {project.images && project.images.length > 0 ? (
                              <img
                                src={
                                  project.images[0] ||
                                  "/placeholder.svg?height=300&width=400&query=construction+building"
                                }
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/construction-building.png"
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
                                <Building className="h-20 w-20 text-orange-500" />
                              </div>
                            )}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="absolute top-4 right-4">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                                <span className="font-bold text-gray-800">{project.rating || "4.8"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pb-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-xl font-bold group-hover:text-orange-600 transition-colors duration-300">
                                {project.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                <span className="text-sm">{(project.town || "Kitale") + ", Kenya"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                              {project.category || "Construction"}
                            </Badge>
                            <Badge variant="secondary" className="bg-red-100 text-red-700">
                              Professional
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{project.description}</p>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="text-xs text-gray-600">Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-gray-600">Professional</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <HardHat className="h-4 w-4 text-orange-500" />
                              <span className="text-xs text-gray-600">Licensed</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-amber-500" />
                              <span className="text-xs text-gray-600">Certified</span>
                            </div>
                          </div>

                          <div className="flex items-end justify-between pt-4 border-t">
                            <div>
                              <p className="text-xs text-gray-500">Price</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                  {project.price || "Contact for quote"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-orange-600 font-medium">Active</p>
                              <p className="text-xs text-gray-500">Available now</p>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="grid grid-cols-2 gap-3 pt-6">
                          <Button
                            variant="outline"
                            asChild
                            className="border-orange-200 hover:bg-orange-50 bg-transparent"
                          >
                            <Link href={`/services/construction/${project.id}`}>View Details</Link>
                          </Button>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          >
                            <Link href={`/contact?service=${project.id}`}>Contact Provider</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : buildingSites.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
                    <Building className="h-20 w-20 text-orange-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Premium Builders Coming Soon
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    We're connecting with Africa's top construction companies and certified builders. Professional
                    construction services will be available soon!
                  </p>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8 py-3">
                    Get Early Access
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {buildingSites.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 h-full">
                        <div className="relative">
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            {project.images && project.images.length > 0 ? (
                              <img
                                src={
                                  project.images[0] ||
                                  "/placeholder.svg?height=300&width=400&query=construction+building"
                                }
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/construction-building.png"
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
                                <Building className="h-20 w-20 text-orange-500" />
                              </div>
                            )}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="absolute top-4 right-4">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                                <span className="font-bold text-gray-800">{project.rating || "4.8"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pb-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-xl font-bold group-hover:text-orange-600 transition-colors duration-300">
                                {project.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                <span className="text-sm">{(project.town || "Kitale") + ", Kenya"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                              Licensed
                            </Badge>
                            <Badge variant="secondary" className="bg-red-100 text-red-700">
                              Insured
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="text-xs text-gray-600">Timeline</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-gray-600">Team Size</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <HardHat className="h-4 w-4 text-orange-500" />
                              <span className="text-xs text-gray-600">Safety First</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-amber-500" />
                              <span className="text-xs text-gray-600">Certified</span>
                            </div>
                          </div>

                          <div className="flex items-end justify-between pt-4 border-t">
                            <div>
                              <p className="text-xs text-gray-500">Starting from</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                  {project.price || "$15K"}
                                </span>
                                <span className="text-sm text-gray-500">/ project</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-orange-600 font-medium">Professional</p>
                              <p className="text-xs text-gray-500">Quality assured</p>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="grid grid-cols-2 gap-3 pt-6">
                          <Button
                            variant="outline"
                            asChild
                            className="border-orange-200 hover:bg-orange-50 bg-transparent"
                          >
                            <Link href={`/services/construction/${project.id}`}>View Details</Link>
                          </Button>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          >
                            <Link href={`/services/construction/${project.id}`}>Get Quote</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="road" className="space-y-6">
              {roadProjects.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
                    <Truck className="h-20 w-20 text-orange-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Infrastructure Projects Coming
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    We're connecting with road construction specialists and infrastructure developers. Major projects
                    will be available soon!
                  </p>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8 py-3">
                    Stay Updated
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {/* Similar card structure for road projects */}
                </div>
              )}
            </TabsContent>

            <TabsContent value="materials" className="space-y-6">
              {constructionMaterials.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
                    <Hammer className="h-20 w-20 text-orange-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Quality Materials Coming
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    We're sourcing premium construction materials and building supplies. Quality materials will be
                    available soon!
                  </p>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8 py-3">
                    Pre-Order Now
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {/* Similar card structure for materials */}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Why Choose Our Construction Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-orange-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Licensed & Insured</h3>
            <p className="text-gray-600 leading-relaxed">
              All contractors are fully licensed, insured, and background-checked for your peace of mind.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-red-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">On-Time Delivery</h3>
            <p className="text-gray-600 leading-relaxed">
              Projects completed on schedule with milestone-based progress tracking and regular updates.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-orange-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Quality Guarantee</h3>
            <p className="text-gray-600 leading-relaxed">
              Premium materials and workmanship backed by comprehensive warranties and quality assurance.
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
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-red-400/20 to-orange-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-3xl border border-orange-100 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Ready to Build Your Dream Project?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with certified construction professionals and get personalized quotes for your building needs.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                className="h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 text-lg"
                asChild
              >
                <a href="tel:+254701524543">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: +254 701 524543
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="h-14 border-orange-200 hover:bg-orange-50 px-8 text-lg"
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


