"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, GraduationCap, Phone, Loader2, BookOpen, Users, DollarSign, MapPin, Calendar, Award, Search, Filter, Star, School, University, Brain, Target } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { getMockEducation } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

export default function EducationPage() {
  const [education, setEducation] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          // Use mock data when Firebase is not available
          console.log("Using mock data for education")
          setEducation(getMockEducation())
          setLoading(false)
          return
        }

        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "education"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const educationData: Service[] = []

        querySnapshot.forEach((doc) => {
          educationData.push({ id: doc.id, ...doc.data() } as Service)
        })

        setEducation(educationData)
      } catch (error) {
        console.error("Error fetching education:", error)
        // Fallback to mock data on error
        setEducation(getMockEducation())
      } finally {
        setLoading(false)
      }
    }

    fetchEducation()
  }, [])

  const getEducationByType = (type: string) => {
    return education.filter((item) => item.institutionType?.toLowerCase() === type.toLowerCase())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-gray-950 dark:to-indigo-950/20">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <span className="text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Loading educational services...
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const schools = getEducationByType("school")
  const colleges = getEducationByType("college")
  const universities = getEducationByType("university")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-gray-950 dark:to-indigo-950/20">
      {/* Hero Section with Search */}
      <div className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-indigo-400/20 to-purple-500/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
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
              Education &
              <br />
              <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Learning Excellence
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Unlock potential with premier educational institutions, courses, and learning opportunities 
              across Africa's most prestigious schools and universities.
            </p>
          </motion.div>

          {/* Education Search Box */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Institution Type</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                    <select className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-blue-400 bg-white">
                      <option value="">All Institutions</option>
                      <option value="school">Schools</option>
                      <option value="college">Colleges</option>
                      <option value="university">Universities</option>
                      <option value="academy">Academies</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-500" />
                    <Input 
                      placeholder="Enter location" 
                      className="pl-10 h-12 border-gray-200 focus:border-indigo-400"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Program Level</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                    <select className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-purple-400 bg-white">
                      <option value="">Any Level</option>
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <Button className="flex-1 h-12 text-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Search Institutions
                </Button>
                <Button variant="outline" className="md:w-auto h-12 border-gray-300 hover:bg-gray-50">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-20">
        {/* Featured Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Premier Educational Institutions
            </h2>
            <p className="text-xl text-gray-900 dark:text-gray-300 max-w-3xl mx-auto">
              Discover top-rated schools, colleges, and universities offering world-class education
            </p>
          </div>

          <Tabs defaultValue="school" className="mb-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
              <TabsTrigger 
                value="school" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <School className="h-4 w-4 mr-2" />
                Schools
              </TabsTrigger>
              <TabsTrigger 
                value="college"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Colleges
              </TabsTrigger>
              <TabsTrigger 
                value="university"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <University className="h-4 w-4 mr-2" />
                Universities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="school" className="space-y-6">
              {schools.length === 0 ? (
                <motion.div 
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <School className="h-20 w-20 text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Premium Schools Coming Soon
                  </h3>
                  <p className="text-lg text-gray-900 dark:text-white max-w-md mx-auto mb-8">
                    We're partnering with Africa's top educational institutions. 
                    Quality schools and academies will be featured soon!
                  </p>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-lg px-8 py-3">
                    Join Waiting List
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {schools.map((school, index) => (
                    <motion.div
                      key={school.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 h-full">
                        <div className="relative">
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            {school.images && school.images.length > 0 ? (
                              <img
                                src={school.images[0] || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"}
                                alt={school.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                                <School className="h-20 w-20 text-blue-500" />
                              </div>
                            )}
                          </div>
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="absolute top-4 right-4">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-blue-400 text-blue-400" />
                                <span className="font-bold text-gray-800">{school.rating || "4.7"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <CardHeader className="pb-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                {school.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-gray-900">
                                <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                <span className="text-sm">{(school.town || "Kitale") + ", Kenya"}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              Accredited
                            </Badge>
                            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                              Excellence
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4 flex-1">
                          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{school.description}</p>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-gray-900">Students</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-amber-500" />
                              <span className="text-xs text-gray-900">Certified</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="text-xs text-gray-900">Open Enrollment</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-indigo-500" />
                              <span className="text-xs text-gray-900">Programs</span>
                            </div>
                          </div>
                          
                          <div className="flex items-end justify-between pt-4 border-t">
                            <div>
                              <p className="text-xs text-gray-900">Tuition from</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                  {school.price || "$2,500"}
                                </span>
                                <span className="text-sm text-gray-900">/ term</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-blue-600 font-medium">Top Rated</p>
                              <p className="text-xs text-gray-900">Quality education</p>
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="grid grid-cols-2 gap-3 pt-6">
                          <Button variant="outline" asChild className="border-blue-200 hover:bg-blue-50">
                            <Link href={`/services/education/${school.id}`}>
                              Learn More
                            </Link>
                          </Button>
                          <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                            <Link href={`/services/education/${school.id}`}>
                              Apply Now
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="college" className="space-y-6">
              {colleges.length === 0 ? (
                <motion.div 
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <BookOpen className="h-20 w-20 text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Top Colleges Available Soon
                  </h3>
                  <p className="text-lg text-gray-900 dark:text-white max-w-md mx-auto mb-8">
                    We're connecting with leading colleges and technical institutions. 
                    Specialized programs will be featured soon!
                  </p>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-lg px-8 py-3">
                    Get Notified
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {/* Similar card structure for colleges */}
                </div>
              )}
            </TabsContent>

            <TabsContent value="university" className="space-y-6">
              {universities.length === 0 ? (
                <motion.div 
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <University className="h-20 w-20 text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Premier Universities Coming
                  </h3>
                  <p className="text-lg text-gray-900 dark:text-white max-w-md mx-auto mb-8">
                    We're partnering with Africa's top-ranked universities. 
                    World-class higher education options coming soon!
                  </p>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-lg px-8 py-3">
                    Early Access
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {/* Similar card structure for universities */}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Why Choose Our Education Platform */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-blue-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Expert Faculty</h3>
            <p className="text-gray-900 leading-relaxed">Learn from qualified educators and industry professionals committed to academic excellence.</p>
          </div>
          
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-indigo-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Career Focused</h3>
            <p className="text-gray-900 leading-relaxed">Programs designed to prepare students for successful careers in their chosen fields.</p>
          </div>
          
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-blue-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Accredited Programs</h3>
            <p className="text-gray-900 leading-relaxed">All institutions are fully accredited with recognized degrees and certifications.</p>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-blue-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-3xl border border-blue-100 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Start Your Educational Journey
            </h3>
            <p className="text-lg text-gray-900 mb-8 max-w-2xl mx-auto">
              Get personalized guidance and connect with admission counselors from top educational institutions.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                className="h-14 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-8 text-lg"
                asChild
              >
                <a href="tel:+254701524543">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: +254 701 524543
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="h-14 border-blue-200 hover:bg-blue-50 px-8 text-lg"
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

