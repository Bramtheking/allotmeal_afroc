"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Play, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"

export default function EntertainmentPage() {
  const [entertainment, setEntertainment] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntertainment = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) return

        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "entertainment"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const entertainmentData: Service[] = []

        querySnapshot.forEach((doc) => {
          entertainmentData.push({ id: doc.id, ...doc.data() } as Service)
        })

        setEntertainment(entertainmentData)
      } catch (error) {
        console.error("Error fetching entertainment:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEntertainment()
  }, [])

  const getEntertainmentByType = (type: string) => {
    return entertainment.filter((item) => item.category?.toLowerCase() === type.toLowerCase())
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading entertainment...</span>
        </div>
      </div>
    )
  }

  const liveEvents = getEntertainmentByType("live")
  const clipEntertainment = getEntertainmentByType("clip")
  const whatsappEntertainment = getEntertainmentByType("whatsapp")

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
          {liveEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎭</div>
              <p className="text-xl font-semibold mb-2">No live events available at the moment</p>
              <p className="text-muted-foreground">Check back later for upcoming shows and performances!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted relative">
                    {event.images && event.images.length > 0 ? (
                      <img
                        src={event.images[0] || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Button size="icon" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                        <Play className="h-6 w-6 text-white" fill="white" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      {event.eventDate && new Date(event.eventDate).toLocaleDateString()}
                      {event.eventTime && ` at ${event.eventTime}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{event.description}</p>
                    {event.price && <p className="font-medium text-yellow-600 dark:text-yellow-400">{event.price}</p>}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/services/entertainment/${event.id}`}>Watch Live Stream</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="clip" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Clip Entertainment</h2>
          {clipEntertainment.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-xl font-semibold mb-2">No clips available at the moment</p>
              <p className="text-muted-foreground">Check back later for new entertainment content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clipEntertainment.map((clip) => (
                <Card key={clip.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted relative">
                    {clip.images && clip.images.length > 0 ? (
                      <img
                        src={clip.images[0] || "/placeholder.svg"}
                        alt={clip.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Button size="icon" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                        <Play className="h-6 w-6 text-white" fill="white" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{clip.title}</CardTitle>
                    <CardDescription>{clip.duration && `Duration: ${clip.duration}`}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{clip.description}</p>
                    {clip.price && <p className="font-medium text-yellow-600 dark:text-yellow-400">{clip.price}</p>}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/services/entertainment/${clip.id}`}>Purchase Clip</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">WhatsApp Entertainment</h2>
          {whatsappEntertainment.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📱</div>
              <p className="text-xl font-semibold mb-2">No WhatsApp entertainment available at the moment</p>
              <p className="text-muted-foreground">Check back later for new entertainment subscriptions!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whatsappEntertainment.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>
                      {item.subscriptionType && `Subscription: ${item.subscriptionType}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{item.description}</p>
                    {item.price && <p className="font-medium text-yellow-600 dark:text-yellow-400">{item.price}</p>}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                      <Link href={`/services/entertainment/${item.id}`}>Subscribe via WhatsApp</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
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
