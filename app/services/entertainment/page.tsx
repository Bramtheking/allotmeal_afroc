"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Play } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Event {
  name: string
  date: string
  time: string
  image: string
  description: string
  price: string
  duration?: string
  subscription?: string
}

export default function EntertainmentPage() {
  const [liveEvents, setLiveEvents] = useState<Event[]>([])
  const [clipEntertainment, setClipEntertainment] = useState<Event[]>([])
  const [whatsappEntertainment, setWhatsappEntertainment] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/services/entertainment")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setLiveEvents(data.liveEvents)
        setClipEntertainment(data.clipEntertainment)
        setWhatsappEntertainment(data.whatsappEntertainment)
      } catch (e: any) {
        setError(e.message)
        console.error("Could not fetch entertainment data:", e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div>Loading entertainment data...</div>
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
