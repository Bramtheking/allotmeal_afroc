import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, GraduationCap, Phone } from "lucide-react"
import Link from "next/link"

const schools = [
  {
    name: "Greenfield Academy",
    type: "Primary School",
    location: "Nairobi, Kenya",
    image: "/placeholder.svg?height=200&width=400",
    description: "A leading primary school with excellent academic and co-curricular programs.",
    features: ["Modern facilities", "Qualified teachers", "Comprehensive curriculum"],
  },
  {
    name: "Hillcrest Secondary School",
    type: "Secondary School",
    location: "Nairobi, Kenya",
    image: "/placeholder.svg?height=200&width=400",
    description: "A prestigious secondary school known for academic excellence and character development.",
    features: ["Science laboratories", "Sports facilities", "Arts program"],
  },
  {
    name: "Sunshine Preparatory",
    type: "Primary School",
    location: "Mombasa, Kenya",
    image: "/placeholder.svg?height=200&width=400",
    description: "A child-centered primary school focusing on holistic development.",
    features: ["Play-based learning", "Small class sizes", "Individual attention"],
  },
]

const colleges = [
  {
    name: "Kenya Technical Institute",
    type: "Technical College",
    location: "Nairobi, Kenya",
    image: "/placeholder.svg?height=200&width=400",
    description: "A leading technical college offering practical skills and industry-relevant courses.",
    courses: ["Electrical Engineering", "Mechanical Engineering", "Information Technology"],
  },
  {
    name: "Hospitality Training College",
    type: "Vocational College",
    location: "Mombasa, Kenya",
    image: "/placeholder.svg?height=200&width=400",
    description: "Specialized training in hospitality and tourism management.",
    courses: ["Hotel Management", "Culinary Arts", "Tourism Management"],
  },
  {
    name: "Business Management Institute",
    type: "Business College",
    location: "Kisumu, Kenya",
    image: "/placeholder.svg?height=200&width=400",
    description: "Focused on developing business leaders and entrepreneurs.",
    courses: ["Business Administration", "Marketing", "Accounting"],
  },
]

const universities = [
  {
    name: "University of Nairobi",
    type: "Public University",
    location: "Nairobi, Kenya",
    image: "/placeholder.svg?height=200&width=400",
    description: "Kenya's premier university offering a wide range of undergraduate and postgraduate programs.",
    faculties: ["Medicine", "Engineering", "Law", "Arts", "Science"],
  },
  {
    name: "Strathmore University",
    type: "Private University",
    location: "Nairobi, Kenya",
    image: "/placeholder.svg?height=200&width=400",
    description: "A leading private university known for excellence in business and technology education.",
    faculties: ["Business", "Information Technology", "Law", "Hospitality"],
  },
  {
    name: "Moi University",
    type: "Public University",
    location: "Eldoret, Kenya",
    image: "/placeholder.svg?height=200&width=400",
    description: "A comprehensive university with strong programs in various disciplines.",
    faculties: ["Education", "Agriculture", "Engineering", "Health Sciences"],
  },
]

export default function EducationPage() {
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

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-8">
        <p className="text-sm">Service charge: KSh 15/- (charged by Safaricom)</p>
      </div>

      <Tabs defaultValue="schools" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="colleges">Colleges</TabsTrigger>
          <TabsTrigger value="universities">Universities</TabsTrigger>
        </TabsList>

        <TabsContent value="schools" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Primary & Secondary Schools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school, index) => (
              <Card
                key={index}
                className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
              >
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={school.image || "/placeholder.svg"}
                    alt={school.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 p-2 w-fit rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                    <GraduationCap className="h-5 w-5 text-yellow-500" />
                  </div>
                  <CardTitle>{school.name}</CardTitle>
                  <CardDescription>
                    {school.type} • {school.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{school.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Features:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {school.features.map((feature, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Programs
                  </Button>
                  <Button className="flex-1">Enrollment</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="colleges" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Technical & Vocational Colleges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college, index) => (
              <Card
                key={index}
                className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
              >
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={college.image || "/placeholder.svg"}
                    alt={college.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle>{college.name}</CardTitle>
                  <CardDescription>
                    {college.type} • {college.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{college.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Popular Courses:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {college.courses.map((course, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Programs
                  </Button>
                  <Button className="flex-1">Admission</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="universities" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Universities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university, index) => (
              <Card
                key={index}
                className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
              >
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={university.image || "/placeholder.svg"}
                    alt={university.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 p-2 w-fit rounded-md bg-gradient-to-br from-yellow-100 to-blue-100 dark:from-yellow-900/30 dark:to-blue-900/30">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{university.name}</CardTitle>
                  <CardDescription>
                    {university.type} • {university.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{university.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Faculties:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {university.faculties.map((faculty, i) => (
                        <span key={i} className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                          {faculty}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Programs
                  </Button>
                  <Button className="flex-1">Admission</Button>
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
