import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Heart, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const medicalCampaigns = [
  {
    title: "Free Medical Camp",
    organizer: "Health Africa Foundation",
    date: "July 15-16, 2023",
    location: "Kibera, Nairobi",
    image: "/placeholder.svg?height=200&width=400",
    description:
      "A two-day medical camp offering free consultations, basic health screenings, and medications for common ailments.",
    services: ["General consultations", "Dental check-ups", "Eye examinations", "Basic medications"],
  },
  {
    title: "Diabetes Awareness Campaign",
    organizer: "Diabetes Kenya Association",
    date: "July 22, 2023",
    location: "Nakuru Town",
    image: "/placeholder.svg?height=200&width=400",
    description: "A one-day campaign focusing on diabetes awareness, screening, and management advice.",
    services: ["Blood sugar testing", "Nutritional advice", "Exercise demonstrations", "Support group formation"],
  },
  {
    title: "Maternal Health Outreach",
    organizer: "Mothers First Initiative",
    date: "July 29-30, 2023",
    location: "Machakos County",
    image: "/placeholder.svg?height=200&width=400",
    description: "A program focused on maternal and child health services for rural communities.",
    services: ["Prenatal check-ups", "Infant vaccinations", "Nutritional supplements", "Health education"],
  },
]

const clinics = [
  {
    name: "City Health Clinic",
    type: "General Practice",
    location: "Nairobi CBD",
    image: "/placeholder.svg?height=200&width=400",
    description: "A modern clinic offering comprehensive healthcare services in the heart of Nairobi.",
    services: ["General consultations", "Laboratory services", "Pharmacy", "Minor procedures"],
    hours: "Mon-Sat: 8am-8pm, Sun: 10am-4pm",
  },
  {
    name: "Family Wellness Center",
    type: "Family Practice",
    location: "Westlands, Nairobi",
    image: "/placeholder.svg?height=200&width=400",
    description: "A family-oriented clinic providing healthcare services for all age groups.",
    services: ["Pediatrics", "Adult medicine", "Geriatrics", "Preventive care"],
    hours: "Mon-Fri: 8am-6pm, Sat: 9am-1pm",
  },
  {
    name: "Coastal Medical Center",
    type: "Multi-specialty Clinic",
    location: "Mombasa",
    image: "/placeholder.svg?height=200&width=400",
    description: "A comprehensive medical center serving the coastal region with specialized care.",
    services: ["Cardiology", "Orthopedics", "Dermatology", "ENT"],
    hours: "24/7 Service",
  },
]

const healthPrograms = [
  {
    title: "Community Health Worker Training",
    organizer: "Ministry of Health",
    duration: "3 months",
    location: "Various Counties",
    image: "/placeholder.svg?height=200&width=400",
    description:
      "A training program for community health workers to improve healthcare delivery at the grassroots level.",
    benefits: [
      "Stipend during training",
      "Certificate upon completion",
      "Employment opportunities",
      "Continuous education",
    ],
  },
  {
    title: "Nutrition and Wellness Program",
    organizer: "Healthy Living Initiative",
    duration: "6 weeks",
    location: "Online & In-person",
    image: "/placeholder.svg?height=200&width=400",
    description: "A comprehensive program focusing on nutrition, physical activity, and overall wellness.",
    benefits: ["Personalized meal plans", "Exercise routines", "Health coaching", "Support community"],
  },
  {
    title: "Mental Health Awareness Workshop",
    organizer: "Mind Matters Kenya",
    duration: "2 days",
    location: "Nairobi & Virtual",
    image: "/placeholder.svg?height=200&width=400",
    description: "A workshop aimed at raising awareness about mental health issues and providing support resources.",
    benefits: ["Expert speakers", "Support resources", "Networking opportunities", "Certificate of participation"],
  },
]

export default function HealthPage() {
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
            {medicalCampaigns.map((campaign, index) => (
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
            {clinics.map((clinic, index) => (
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
            {healthPrograms.map((program, index) => (
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
