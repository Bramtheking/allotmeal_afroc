"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Heart, MapPin, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"

export default function HealthPage() {
  const [health, setHealth] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) return

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

        setHealth(healthData)
      } catch (error) {
        console.error("Error fetching health:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
  }, [])

  const getHealthByType = (type: string) => {
    return health.filter((item) => item.healthType?.toLowerCase() === type.toLowerCase())
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading health services...</span>
        </div>
      </div>
    )
  }

  const medicalCampaigns = getHealthByType("campaign")
  const clinics = getHealthByType("clinic")
  const healthPrograms = getHealthByType("program")

  return (
    <div className="container py-32">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/#services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">Health Sector</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Access medical campaigns, clinics, programs, and health seminars across Africa. Stay informed about health
        initiatives and access quality healthcare services through our platform.
      </p>

      <Tabs defaultValue="campaigns" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="campaigns">Medical Campaigns</TabsTrigger>
          <TabsTrigger value="clinics">Clinics</TabsTrigger>
          <TabsTrigger value="programs">Health Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Medical Campaigns</h2>
          {medicalCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏥</div>
              <p className="text-xl font-semibold mb-2">No medical campaigns available at the moment</p>
              <p className="text-muted-foreground">Check back later for upcoming health campaigns!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicalCampaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="aspect-video w-full bg-muted">
                    {campaign.images && campaign.images.length > 0 ? (
                      <img
                        src={campaign.images[0] || "/placeholder.svg"}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-red-100 dark:bg-red-900/30">
                      <Heart className="h-5 w-5 text-red-500" />
                    </div>
                    <CardTitle>{campaign.title}</CardTitle>
                    <CardDescription>{campaign.organizer || campaign.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {campaign.eventDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(campaign.eventDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {campaign.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{campaign.location}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm mb-3">{campaign.description}</p>
                    {campaign.services && campaign.services.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Services:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {campaign.services.slice(0, 3).map((service, i) => (
                            <Badge key={i} variant="outline">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/services/health/${campaign.id}`}>More Info</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href={`/services/health/${campaign.id}`}>Register</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="clinics" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Medical Clinics</h2>
          {clinics.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🩺</div>
              <p className="text-xl font-semibold mb-2">No clinics available at the moment</p>
              <p className="text-muted-foreground">Check back later for new healthcare providers!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinics.map((clinic) => (
                <Card
                  key={clinic.id}
                  className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="aspect-video w-full bg-muted">
                    {clinic.images && clinic.images.length > 0 ? (
                      <img
                        src={clinic.images[0] || "/placeholder.svg"}
                        alt={clinic.title}
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
                      <Heart className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{clinic.title}</CardTitle>
                    <CardDescription>
                      {clinic.clinicType || clinic.category} • {clinic.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{clinic.description}</p>
                    {clinic.services && clinic.services.length > 0 && (
                      <div className="text-sm mb-3">
                        <p className="font-medium mb-1">Services:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {clinic.services.slice(0, 3).map((service, i) => (
                            <Badge key={i} variant="outline">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {clinic.operatingHours && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Hours:</p>
                        <p className="text-muted-foreground">{clinic.operatingHours}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/services/health/${clinic.id}`}>View Details</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href={`/services/health/${clinic.id}`}>Book Appointment</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Health Programs & Seminars</h2>
          {healthPrograms.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💊</div>
              <p className="text-xl font-semibold mb-2">No health programs available at the moment</p>
              <p className="text-muted-foreground">Check back later for new health initiatives!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthPrograms.map((program) => (
                <Card
                  key={program.id}
                  className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="aspect-video w-full bg-muted">
                    {program.images && program.images.length > 0 ? (
                      <img
                        src={program.images[0] || "/placeholder.svg"}
                        alt={program.title}
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
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{program.title}</CardTitle>
                    <CardDescription>{program.organizer || program.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {program.duration && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Duration: {program.duration}</span>
                        </div>
                      )}
                      {program.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{program.location}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm mb-3">{program.description}</p>
                    {program.benefits && program.benefits.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Benefits:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {program.benefits.slice(0, 3).map((benefit, i) => (
                            <Badge key={i} variant="outline">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/services/health/${program.id}`}>Learn More</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href={`/services/health/${program.id}`}>Enroll</Link>
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
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" /> Contact Customer Care
          </Button>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/#services">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>
        </Button>
      </div>
    </div>
  )
}
