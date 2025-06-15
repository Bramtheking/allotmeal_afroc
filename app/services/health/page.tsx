"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Heart, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface MedicalCampaign {
  title: string
  organizer: string
  date: string
  location: string
  image: string
  description: string
  services: string[]
}

interface Clinic {
  name: string
  type: string
  location: string
  image: string
  description: string
  services: string[]
  hours: string
}

interface HealthProgram {
  title: string
  organizer: string
  duration: string
  location: string
  image: string
  description: string
  benefits: string[]
}

export default function HealthPage() {
  const [medicalCampaigns, setMedicalCampaigns] = useState<MedicalCampaign[] | null>(null)
  const [clinics, setClinics] = useState<Clinic[] | null>(null)
  const [healthPrograms, setHealthPrograms] = useState<HealthProgram[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/services/health")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMedicalCampaigns(data.medicalCampaigns)
        setClinics(data.clinics)
        setHealthPrograms(data.healthPrograms)
      } catch (e: any) {
        setError(e.message)
        console.error("Could not fetch health data:", e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div>Loading health services...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

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

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-8">
        <p className="text-sm">Service charge: KSh 20/- (charged by Safaricom)</p>
      </div>

      <Tabs defaultValue="campaigns" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="campaigns">Medical Campaigns</TabsTrigger>
          <TabsTrigger value="clinics">Clinics</TabsTrigger>
          <TabsTrigger value="programs">Health Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Medical Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicalCampaigns &&
              medicalCampaigns.map((campaign, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="aspect-video w-full bg-muted">
                    <img
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-red-100 dark:bg-red-900/30">
                      <Heart className="h-5 w-5 text-red-500" />
                    </div>
                    <CardTitle>{campaign.title}</CardTitle>
                    <CardDescription>{campaign.organizer}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{campaign.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{campaign.location}</span>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{campaign.description}</p>
                    <div className="text-sm">
                      <p className="font-medium mb-1">Services:</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {campaign.services.map((service, i) => (
                          <Badge key={i} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      More Info
                    </Button>
                    <Button className="flex-1">Register</Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="clinics" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Medical Clinics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics &&
              clinics.map((clinic, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="aspect-video w-full bg-muted">
                    <img
                      src={clinic.image || "/placeholder.svg"}
                      alt={clinic.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                      <Heart className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{clinic.name}</CardTitle>
                    <CardDescription>
                      {clinic.type} • {clinic.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{clinic.description}</p>
                    <div className="text-sm mb-3">
                      <p className="font-medium mb-1">Services:</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {clinic.services.map((service, i) => (
                          <Badge key={i} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium mb-1">Hours:</p>
                      <p className="text-muted-foreground">{clinic.hours}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button className="flex-1">Book Appointment</Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Health Programs & Seminars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthPrograms &&
              healthPrograms.map((program, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="aspect-video w-full bg-muted">
                    <img
                      src={program.image || "/placeholder.svg"}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-gradient-to-br from-yellow-100 to-blue-100 dark:from-yellow-900/30 dark:to-blue-900/30">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{program.title}</CardTitle>
                    <CardDescription>{program.organizer}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Duration: {program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{program.location}</span>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{program.description}</p>
                    <div className="text-sm">
                      <p className="font-medium mb-1">Benefits:</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {program.benefits.map((benefit, i) => (
                          <Badge key={i} variant="outline">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Learn More
                    </Button>
                    <Button className="flex-1">Enroll</Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
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
