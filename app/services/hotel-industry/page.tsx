import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Star } from "lucide-react"
import Link from "next/link"

const hotels = [
  {
    name: "Serena Hotel",
    location: "Nairobi, Kenya",
    rating: 5,
    image: "/placeholder.svg?height=200&width=400",
    description: "Luxury hotel with excellent amenities and world-class service.",
  },
  {
    name: "Hilton Garden Inn",
    location: "Nairobi, Kenya",
    rating: 4,
    image: "/placeholder.svg?height=200&width=400",
    description: "Modern hotel with comfortable rooms and great dining options.",
  },
  {
    name: "Sarova Stanley",
    location: "Nairobi, Kenya",
    rating: 4,
    image: "/placeholder.svg?height=200&width=400",
    description: "Historic hotel with elegant rooms and exceptional service.",
  },
  {
    name: "Tamarind Tree Hotel",
    location: "Nairobi, Kenya",
    rating: 4,
    image: "/placeholder.svg?height=200&width=400",
    description: "Contemporary hotel with beautiful gardens and pool area.",
  },
]

export default function HotelIndustryPage() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={hotel.image || "/placeholder.svg"}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{hotel.name}</CardTitle>
                  <CardDescription>{hotel.location}</CardDescription>
                  <div className="flex items-center mt-1">
                    {Array(hotel.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{hotel.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View Menu</Button>
                  <Button>Book Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="accommodation" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Available Accommodations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={hotel.image || "/placeholder.svg"}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{hotel.name}</CardTitle>
                  <CardDescription>{hotel.location}</CardDescription>
                  <div className="flex items-center mt-1">
                    {Array(hotel.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{hotel.description}</p>
                  <div className="mt-4">
                    <p className="font-medium">Room Types:</p>
                    <ul className="text-sm list-disc list-inside">
                      <li>Standard Room</li>
                      <li>Deluxe Room</li>
                      <li>Executive Suite</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Accommodation</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="whatsapp" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">WhatsApp Hotel Services</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Connect with hotels directly via WhatsApp for quick inquiries, bookings, and customer service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{hotel.name}</CardTitle>
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
            ))}
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
