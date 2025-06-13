import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Phone } from "lucide-react"
import Link from "next/link"

const privateTenders = [
  {
    title: "Hotel Renovation Project",
    company: "Luxury Hotels Group",
    location: "Nairobi, Kenya",
    budget: "KSh 15,000,000 - 20,000,000",
    deadline: "July 30, 2023",
    description:
      "Seeking contractors for a complete renovation of a 50-room hotel including lobby, restaurant, and guest rooms.",
    requirements: [
      "Minimum 5 years experience in hotel renovation",
      "Portfolio of similar projects",
      "Ability to complete within 6 months",
    ],
  },
  {
    title: "Corporate Office Design",
    company: "Tech Innovate Ltd",
    location: "Mombasa, Kenya",
    budget: "KSh 5,000,000 - 8,000,000",
    deadline: "August 15, 2023",
    description: "Interior design and furnishing for a new corporate office space of 1,000 square meters.",
    requirements: [
      "Experience in modern office design",
      "Ability to source quality furniture and fixtures",
      "Green building certification is a plus",
    ],
  },
  {
    title: "Private School Construction",
    company: "Education Foundation",
    location: "Kisumu, Kenya",
    budget: "KSh 25,000,000 - 30,000,000",
    deadline: "September 1, 2023",
    description:
      "Construction of a new private school including classrooms, administration block, and sports facilities.",
    requirements: [
      "Experience in educational facility construction",
      "Compliance with safety standards for schools",
      "Ability to complete within 12 months",
    ],
  },
]

const publicTenders = [
  {
    title: "Road Rehabilitation Project",
    agency: "Ministry of Transport",
    location: "Nakuru County",
    budget: "KSh 50,000,000 - 70,000,000",
    deadline: "July 25, 2023",
    description: "Rehabilitation of 20km of urban roads including drainage systems and street lighting.",
    requirements: [
      "Registration with National Construction Authority (NCA)",
      "Previous experience in road construction",
      "Financial capability to undertake the project",
    ],
  },
  {
    title: "Public Hospital Expansion",
    agency: "Ministry of Health",
    location: "Machakos County",
    budget: "KSh 100,000,000 - 120,000,000",
    deadline: "August 10, 2023",
    description: "Construction of a new wing for the county referral hospital including wards and operating theaters.",
    requirements: [
      "Experience in healthcare facility construction",
      "Compliance with medical facility standards",
      "Ability to work in a functioning hospital environment",
    ],
  },
  {
    title: "Water Supply System",
    agency: "Water Services Board",
    location: "Kajiado County",
    budget: "KSh 80,000,000 - 90,000,000",
    deadline: "September 5, 2023",
    description: "Installation of water supply infrastructure including boreholes, pipelines, and storage tanks.",
    requirements: [
      "Specialized experience in water infrastructure",
      "Environmental impact assessment capability",
      "Community engagement experience",
    ],
  },
]

export default function TendersPage() {
  return (
    <div className="container py-32">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/#services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">Tenders</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Access private and public tender opportunities for business growth and expansion. Browse available tenders and
        submit your bids through our platform.
      </p>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-8">
        <p className="text-sm">Service charge: KSh 50/- (charged by Safaricom)</p>
      </div>

      <Tabs defaultValue="private" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="private">Private Jobs</TabsTrigger>
          <TabsTrigger value="public">Public Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="private" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Private Tender Opportunities</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {privateTenders.map((tender, index) => (
              <Card
                key={index}
                className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
              >
                <CardHeader>
                  <div className="mb-2 p-2 w-fit rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                    <FileText className="h-5 w-5 text-yellow-500" />
                  </div>
                  <CardTitle>{tender.title}</CardTitle>
                  <CardDescription>
                    {tender.company} • {tender.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Budget:</span>
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{tender.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Deadline:</span>
                      <span className="text-sm font-medium">{tender.deadline}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{tender.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {tender.requirements.map((req, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Apply for Tender</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="public" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Public Tender Opportunities</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {publicTenders.map((tender, index) => (
              <Card
                key={index}
                className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
              >
                <CardHeader>
                  <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle>{tender.title}</CardTitle>
                  <CardDescription>
                    {tender.agency} • {tender.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Budget:</span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{tender.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Deadline:</span>
                      <span className="text-sm font-medium">{tender.deadline}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{tender.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {tender.requirements.map((req, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Apply for Tender</Button>
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
        <Button variant="outline">WhatsApp Support</Button>
      </div>
    </div>
  )
}
