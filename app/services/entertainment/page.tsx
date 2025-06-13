import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Play } from "lucide-react"
import Link from "next/link"

const liveEvents = [
  {
    name: "Sauti Sol Live Concert",
    date: "June 25, 2023",
    time: "7:00 PM",
    image: "/placeholder.svg?height=200&width=400",
    description: "Experience the electrifying performance of Kenya's top band.",
    price: "KSh 2,000",
  },
  {
    name: "Comedy Night",
    date: "July 2, 2023",
    time: "8:00 PM",
    image: "/placeholder.svg?height=200&width=400",
    description: "Laugh your heart out with the funniest comedians in East Africa.",
    price: "KSh 1,500",
  },
  {
    name: "Jazz Festival",
    date: "July 15, 2023",
    time: "6:00 PM",
    image: "/placeholder.svg?height=200&width=400",
    description: "A night of smooth jazz music featuring local and international artists.",
    price: "KSh 3,000",
  },
]

const clipEntertainment = [
  {
    name: "Best of African Comedy",
    duration: "45 minutes",
    image: "/placeholder.svg?height=200&width=400",
    description: "A compilation of the funniest African comedy clips.",
    price: "KSh 500",
  },
  {
    name: "Music Video Collection",
    duration: "60 minutes",
    image: "/placeholder.svg?height=200&width=400",
    description: "Top music videos from East African artists.",
    price: "KSh 700",
  },
  {
    name: "Documentary: African Wildlife",
    duration: "90 minutes",
    image: "/placeholder.svg?height=200&width=400",
    description: "Explore the rich wildlife of Africa in this stunning documentary.",
    price: "KSh 1,000",
  },
]

const whatsappEntertainment = [
  {
    name: "Daily Jokes",
    subscription: "Weekly",
    image: "/placeholder.svg?height=200&width=400",
    description: "Receive daily jokes on your WhatsApp to brighten your day.",
    price: "KSh 50/week",
  },
  {
    name: "Music Updates",
    subscription: "Monthly",
    image: "/placeholder.svg?height=200&width=400",
    description: "Get updates on the latest music releases and entertainment news.",
    price: "KSh 100/month",
  },
  {
    name: "Event Notifications",
    subscription: "Monthly",
    image: "/placeholder.svg?height=200&width=400",
    description: "Never miss an event with our WhatsApp notification service.",
    price: "KSh 150/month",
  },
]

export default function EntertainmentPage() {
  return (
    <div className="container py-32">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/#services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">Entertainment & Gigs</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Access live streaming, clip entertainment, and exclusive entertainment content. Enjoy the best of African
        entertainment at your fingertips.
      </p>

      <Tabs defaultValue="live" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="live">Live Streaming</TabsTrigger>
          <TabsTrigger value="clip">Clip Entertainment</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp Entertainment</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Live Streaming Entertainment</h2>
          <p className="text-muted-foreground mb-6">Charges: 0.5 cents/mb/s</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveEvents.map((event, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted relative">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button size="icon" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <Play className="h-6 w-6 text-white" fill="white" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>
                    {event.date} at {event.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{event.description}</p>
                  <p className="font-medium text-yellow-600 dark:text-yellow-400">{event.price}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Watch Live Stream</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clip" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Clip Entertainment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clipEntertainment.map((clip, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted relative">
                  <img src={clip.image || "/placeholder.svg"} alt={clip.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button size="icon" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <Play className="h-6 w-6 text-white" fill="white" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{clip.name}</CardTitle>
                  <CardDescription>Duration: {clip.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{clip.description}</p>
                  <p className="font-medium text-yellow-600 dark:text-yellow-400">{clip.price}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Purchase Clip</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">WhatsApp Entertainment</h2>
          <p className="text-muted-foreground mb-6">Charges: KSh 10/- per view</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatsappEntertainment.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>Subscription: {item.subscription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{item.description}</p>
                  <p className="font-medium text-yellow-600 dark:text-yellow-400">{item.price}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Subscribe via WhatsApp</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Exit or Contact Customer Service</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline">Exit</Button>
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
