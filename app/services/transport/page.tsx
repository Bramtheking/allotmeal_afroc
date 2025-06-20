"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Plane, Ship, Truck, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"

export default function TransportPage() {
  const [transport, setTransport] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) return

        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "transport"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const transportData: Service[] = []

        querySnapshot.forEach((doc) => {
          transportData.push({ id: doc.id, ...doc.data() } as Service)
        })

        setTransport(transportData)
      } catch (error) {
        console.error("Error fetching transport:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransport()
  }, [])

  const getTransportByType = (type: string) => {
    return transport.filter((item) => item.transportType?.toLowerCase() === type.toLowerCase())
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading transport...</span>
        </div>
      </div>
    )
  }

  const roadTransport = getTransportByType("road")
  const airTransport = getTransportByType("air")
  const oceanTransport = getTransportByType("ocean")

  return (
    <div className="container py-32">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/#services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">Transport Infrastructure</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Find road, air, and ocean transport services with comprehensive scheduling information. Book tickets and access
        transportation services across Africa.
      </p>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-8">
        <p className="text-sm">Service charge: KSh 15/- (charged by Safaricom)</p>
      </div>

      <Tabs defaultValue="road" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="road">Road</TabsTrigger>
          <TabsTrigger value="air">Air</TabsTrigger>
          <TabsTrigger value="ocean">Ocean</TabsTrigger>
        </TabsList>

        <TabsContent value="road" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Road Transport</h2>
          {roadTransport.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚌</div>
              <p className="text-xl font-semibold mb-2">No road transport services available at the moment</p>
              <p className="text-muted-foreground">Check back later for new bus and taxi routes!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadTransport.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
                >
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
                    <div className="mb-2 p-2 w-fit rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                      <Truck className="h-5 w-5 text-yellow-500" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {item.route && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.route}</span>
                        </div>
                      )}
                      {item.departureTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Departure: {item.departureTime}</span>
                        </div>
                      )}
                      {item.duration && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Duration: {item.duration}</span>
                        </div>
                      )}
                      {item.price && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                            Price: {item.price}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm mb-3">{item.description}</p>
                    {item.features && item.features.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Features:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.features.slice(0, 3).map((feature, i) => (
                            <Badge key={i} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Schedule
                    </Button>
                    <Button className="flex-1">Book Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="air" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Air Transport</h2>
          {airTransport.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✈️</div>
              <p className="text-xl font-semibold mb-2">No air transport services available at the moment</p>
              <p className="text-muted-foreground">Check back later for new flight schedules!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {airTransport.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                >
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
                    <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                      <Plane className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.airline || item.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {item.route && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.route}</span>
                        </div>
                      )}
                      {item.departureTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Departure: {item.departureTime}</span>
                        </div>
                      )}
                      {item.duration && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Duration: {item.duration}</span>
                        </div>
                      )}
                      {item.price && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Price: {item.price}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm mb-3">{item.description}</p>
                    {item.features && item.features.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Features:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.features.slice(0, 3).map((feature, i) => (
                            <Badge key={i} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Flights
                    </Button>
                    <Button className="flex-1">Book Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ocean" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Ocean Transport</h2>
          {oceanTransport.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚢</div>
              <p className="text-xl font-semibold mb-2">No ocean transport services available at the moment</p>
              <p className="text-muted-foreground">Check back later for new maritime schedules!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {oceanTransport.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
                >
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
                    <div className="mb-2 p-2 w-fit rounded-md bg-gradient-to-br from-yellow-100 to-blue-100 dark:from-yellow-900/30 dark:to-blue-900/30">
                      <Ship className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {item.route && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.route}</span>
                        </div>
                      )}
                      {item.departureTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Departure: {item.departureTime}</span>
                        </div>
                      )}
                      {item.duration && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Duration: {item.duration}</span>
                        </div>
                      )}
                      {item.price && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary">Price: {item.price}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm mb-3">{item.description}</p>
                    {item.features && item.features.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Features:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.features.slice(0, 3).map((feature, i) => (
                            <Badge key={i} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Schedule
                    </Button>
                    <Button className="flex-1">Book Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Payment Options</h3>
        <p className="mb-4">
          You can pay for transport services using various payment methods including M-Pesa, credit cards, and bank
          transfers.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline">Pay with M-Pesa</Button>
          <Button variant="outline">Credit Card</Button>
          <Button variant="outline">Bank Transfer</Button>
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
