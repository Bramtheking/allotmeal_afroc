import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Briefcase, Phone, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

const casualJobs = [
  {
    title: "Event Usher",
    company: "Events Kenya Ltd",
    location: "Nairobi, Kenya",
    type: "Casual",
    duration: "1 day",
    salary: "KSh 2,000 per day",
    description: "We are looking for ushers for an upcoming corporate event.",
    requirements: ["Good communication skills", "Well-groomed", "Previous experience is a plus"],
  },
  {
    title: "Construction Helper",
    company: "Build Right Construction",
    location: "Mombasa, Kenya",
    type: "Casual",
    duration: "2 weeks",
    salary: "KSh 1,500 per day",
    description: "Casual laborers needed for a construction project in Mombasa.",
    requirements: ["Physical fitness", "Ability to follow instructions", "Available for the full duration"],
  },
  {
    title: "Data Entry Clerk",
    company: "DataTech Solutions",
    location: "Nairobi, Kenya",
    type: "Casual",
    duration: "1 month",
    salary: "KSh 25,000 per month",
    description: "Data entry clerks needed for a short-term project.",
    requirements: ["Fast typing speed", "Attention to detail", "Computer literacy"],
  },
]

const permanentJobs = [
  {
    title: "Marketing Manager",
    company: "African Brands Ltd",
    location: "Nairobi, Kenya",
    type: "Permanent",
    experience: "5+ years",
    salary: "KSh 150,000 - 200,000 per month",
    description: "We are seeking an experienced Marketing Manager to lead our marketing team.",
    requirements: [
      "Bachelor's degree in Marketing or related field",
      "5+ years of marketing experience",
      "Excellent leadership skills",
    ],
  },
  {
    title: "Software Developer",
    company: "Tech Innovate",
    location: "Nairobi, Kenya",
    type: "Permanent",
    experience: "3+ years",
    salary: "KSh 100,000 - 150,000 per month",
    description: "Looking for a skilled Software Developer to join our growing team.",
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "3+ years of software development experience",
      "Proficiency in JavaScript, React, and Node.js",
    ],
  },
  {
    title: "Accountant",
    company: "Financial Solutions Ltd",
    location: "Kisumu, Kenya",
    type: "Permanent",
    experience: "2+ years",
    salary: "KSh 80,000 - 100,000 per month",
    description: "We are hiring an Accountant to handle our financial operations.",
    requirements: [
      "Bachelor's degree in Accounting or Finance",
      "2+ years of accounting experience",
      "Knowledge of accounting software",
      "CPA certification is a plus",
    ],
  },
]

export default function JobsPage() {
  return (
    <div className="container py-32">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/#services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">Jobs</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Find casual and permanent job opportunities across various industries and sectors. Browse job listings and apply
        directly through our platform.
      </p>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search jobs..." className="pl-9" />
          </div>
          <Button>Search</Button>
        </div>
      </div>

      <Tabs defaultValue="casual" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="casual">Casual Jobs</TabsTrigger>
          <TabsTrigger value="permanent">Permanent Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="casual" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Casual Job Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {casualJobs.map((job, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <div className="mb-2 p-2 w-fit rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                    <Briefcase className="h-5 w-5 text-yellow-500" />
                  </div>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>
                    {job.company} • {job.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <span className="text-sm font-medium">{job.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <span className="text-sm font-medium">{job.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Salary:</span>
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{job.salary}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{job.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Apply Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permanent" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Permanent Job Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {permanentJobs.map((job, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>
                    {job.company} • {job.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <span className="text-sm font-medium">{job.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Experience:</span>
                      <span className="text-sm font-medium">{job.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Salary:</span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{job.salary}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{job.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Apply Now</Button>
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
          <Button variant="outline">Back to Menu</Button>
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
