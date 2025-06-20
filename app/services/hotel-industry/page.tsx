"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"

export default function HotelIndustryPage() {
  const [hotels, setHotels] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) return

        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "hotel-industry"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const hotelData: Service[] = []

        querySnapshot.forEach((doc) => {
          hotelData.push({ id: doc.id, ...doc.data() } as Service)
        })

        setHotels(hotelData)
      } catch (error) {
        console.error("Error fetching hotels:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [])

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading hotels...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-32">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/#services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">Hotel & Industry</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Connect with registered hotels across Africa. Browse food menus, book accommodations, and access exclusive hotel
        services through our platform.
      </p>

      <Tabs defaultValue="food" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="food">Food Menu</TabsTrigger>
          <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp Hotel</TabsTrigger>
        </TabsList>

        <TabsContent value="food" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Featured Hotels</h2>
          {hotels.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏨</div>
              <p className="text-xl font-semibold mb-2">No hotels available at the moment</p>
              <p className="text-muted-foreground">Check back later for new hotel listings!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    {hotel.images && hotel.images.length > 0 ? (
                      <img
                        src={hotel.images[0] || "/placeholder.svg"}
                        alt={hotel.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{hotel.title}</CardTitle>
                    <CardDescription>{hotel.location}</CardDescription>
                    {hotel.rating && (
                      <div className="flex items-center mt-1">
                        {Array(hotel.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{hotel.description}</p>
                    {hotel.price && (
                      <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mt-2">{hotel.price}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Menu</Button>
                    <Button>Book Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="accommodation" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Available Accommodations</h2>
          {hotels.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛏️</div>
              <p className="text-xl font-semibold mb-2">No accommodations available at the moment</p>
              <p className="text-muted-foreground">Check back later for new room options!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    {hotel.images && hotel.images.length > 0 ? (
                      <img
                        src={hotel.images[0] || "/placeholder.svg"}
                        alt={hotel.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{hotel.title}</CardTitle>
                    <CardDescription>{hotel.location}</CardDescription>
                    {hotel.rating && (
                      <div className="flex items-center mt-1">
                        {Array(hotel.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{hotel.description}</p>
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="mt-4">
                        <p className="font-medium">Room Types:</p>
                        <ul className="text-sm list-disc list-inside">
                          {hotel.amenities.slice(0, 3).map((amenity, i) => (
                            <li key={i}>{amenity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {hotel.price && (
                      <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mt-2">{hotel.price}</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Book Accommodation</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">WhatsApp Hotel Services</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Connect with hotels directly via WhatsApp for quick inquiries, bookings, and customer service.
          </p>
          {hotels.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📱</div>
              <p className="text-xl font-semibold mb-2">No WhatsApp services available at the moment</p>
              <p className="text-muted-foreground">Check back later for direct hotel contacts!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotels.map((hotel) => (
                <Card key={hotel.id}>
                  <CardHeader>
                    <CardTitle>{hotel.title}</CardTitle>
                    <CardDescription>{hotel.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{hotel.description}</p>
                    {hotel.contact && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Phone className="h-5 w-5" />
                        <span>WhatsApp: {hotel.contact}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Connect via WhatsApp</Button>
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
          You can pay for hotel services using various payment methods including M-Pesa, credit cards, and bank
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
