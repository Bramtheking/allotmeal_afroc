"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, GraduationCap, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"

export default function EducationPage() {
  const [education, setEducation] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) return

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
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading education...</span>
        </div>
      </div>
    )
  }

  const schools = getEducationByType("school")
  const colleges = getEducationByType("college")
  const universities = getEducationByType("university")

  return (
    <div className="container py-32">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/#services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">Education</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Connect with schools, colleges, and universities for educational programs and enrollment. Explore educational
        institutions across Africa and access information about their programs and admission processes.
      </p>

      <Tabs defaultValue="schools" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="colleges">Colleges</TabsTrigger>
          <TabsTrigger value="universities">Universities</TabsTrigger>
        </TabsList>

        <TabsContent value="schools" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Primary & Secondary Schools</h2>
          {schools.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏫</div>
              <p className="text-xl font-semibold mb-2">No schools available at the moment</p>
              <p className="text-muted-foreground">Check back later for new school listings!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school) => (
                <Card
                  key={school.id}
                  className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="aspect-video w-full bg-muted">
                    {school.images && school.images.length > 0 ? (
                      <img
                        src={school.images[0] || "/placeholder.svg"}
                        alt={school.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                      <GraduationCap className="h-5 w-5 text-yellow-500" />
                    </div>
                    <CardTitle>{school.title}</CardTitle>
                    <CardDescription>
                      {school.schoolType || school.institutionType} • {school.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{school.description}</p>
                    {school.fees && (
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-2">
                        Fees: {school.fees}
                      </p>
                    )}
                    {school.programs && school.programs.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Programs:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {school.programs.slice(0, 3).map((program, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {program}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/services/education/${school.id}`}>Programs</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href={`/services/education/${school.id}`}>Enrollment</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="colleges" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Technical & Vocational Colleges</h2>
          {colleges.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎓</div>
              <p className="text-xl font-semibold mb-2">No colleges available at the moment</p>
              <p className="text-muted-foreground">Check back later for new college programs!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college) => (
                <Card
                  key={college.id}
                  className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="aspect-video w-full bg-muted">
                    {college.images && college.images.length > 0 ? (
                      <img
                        src={college.images[0] || "/placeholder.svg"}
                        alt={college.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{college.title}</CardTitle>
                    <CardDescription>
                      {college.collegeType || college.institutionType} • {college.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{college.description}</p>
                    {college.fees && (
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Fees: {college.fees}</p>
                    )}
                    {college.courses && college.courses.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Popular Courses:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {college.courses.slice(0, 3).map((course, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {course}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/services/education/${college.id}`}>Programs</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href={`/services/education/${college.id}`}>Admission</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="universities" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Universities</h2>
          {universities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏛️</div>
              <p className="text-xl font-semibold mb-2">No universities available at the moment</p>
              <p className="text-muted-foreground">Check back later for new university programs!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map((university) => (
                <Card
                  key={university.id}
                  className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="aspect-video w-full bg-muted">
                    {university.images && university.images.length > 0 ? (
                      <img
                        src={university.images[0] || "/placeholder.svg"}
                        alt={university.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-gradient-to-br from-yellow-100 to-blue-100 dark:from-yellow-900/30 dark:to-blue-900/30">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{university.title}</CardTitle>
                    <CardDescription>
                      {university.universityType || university.institutionType} • {university.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{university.description}</p>
                    {university.fees && (
                      <p className="text-sm font-medium text-primary mb-2">Fees: {university.fees}</p>
                    )}
                    {university.faculties && university.faculties.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Faculties:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {university.faculties.slice(0, 4).map((faculty, i) => (
                            <span key={i} className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                              {faculty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/services/education/${university.id}`}>Programs</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href={`/services/education/${university.id}`}>Admission</Link>
                    </Button>
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
          <Button variant="outline" asChild>
            <Link href="/#services">Back to Menu</Link>
          </Button>
          <Button variant="outline">WhatsApp (KSh 10/-)</Button>
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
