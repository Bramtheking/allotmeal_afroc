"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Star } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Hotel {
  id: string
  title: string
  location: string
  rating?: number
  image?: string
  description: string
  subcategory: string
  price?: string
  features?: string[]
}

export default function HotelIndustryPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/hotel-industry`)
      if (!response.ok) throw new Error("Failed to fetch hotels")
      const data = await response.json()
      setHotels(data.services || [])
    } catch (err) {
      setError("Failed to load hotels")
      console.error("Error fetching hotels:", err)
    } finally {
      setLoading(false)
    }
  }

  const getHotelsBySubcategory = (subcategory: string) => {
    return hotels.filter((hotel) => hotel.subcategory === subcategory)
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading hotel services...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchHotels}>Try Again</Button>
          </div>
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
          <h2 className="text-2xl font-semibold mb-6">Featured Hotels - Food Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getHotelsBySubcategory("food").length > 0 ? (
              getHotelsBySubcategory("food").map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    <img
                      src={hotel.image || "/placeholder.svg?height=200&width=400"}
                      alt={hotel.title}
                      className="w-full h-full object-cover"
                    />
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
                      <p className="font-medium text-yellow-600 dark:text-yellow-400 mt-2">{hotel.price}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Menu</Button>
                    <Button>Book Now</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No hotel food menus available at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="accommodation" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Available Accommodations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getHotelsBySubcategory("accommodation").length > 0 ? (
              getHotelsBySubcategory("accommodation").map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    <img
                      src={hotel.image || "/placeholder.svg?height=200&width=400"}
                      alt={hotel.title}
                      className="w-full h-full object-cover"
                    />
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
                    {hotel.features && hotel.features.length > 0 && (
                      <div className="mt-4">
                        <p className="font-medium">Room Types:</p>
                        <ul className="text-sm list-disc list-inside">
                          {hotel.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {hotel.price && <p className="font-medium text-blue-600 dark:text-blue-400 mt-2">{hotel.price}</p>}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Book Accommodation</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No accommodations available at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">WhatsApp Hotel Services</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Connect with hotels directly via WhatsApp for quick inquiries, bookings, and customer service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getHotelsBySubcategory("whatsapp").length > 0 ? (
              getHotelsBySubcategory("whatsapp").map((hotel) => (
                <Card key={hotel.id}>
                  <CardHeader>
                    <CardTitle>{hotel.title}</CardTitle>
                    <CardDescription>{hotel.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{hotel.description}</p>
                    <div className="flex items-center gap-2 text-green-600">
                      <Phone className="h-5 w-5" />
                      <span>WhatsApp Available</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Connect via WhatsApp</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No WhatsApp hotel services available at the moment.</p>
              </div>
            )}
          </div>
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
