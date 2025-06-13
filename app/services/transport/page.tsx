import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Plane, Ship, Truck } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const roadTransport = [
  {
    name: "Express Bus Service",
    company: "Safari Express",
    route: "Nairobi - Mombasa",
    departure: "7:00 AM, 10:00 AM, 2:00 PM",
    duration: "8 hours",
    price: "KSh 1,500",
    image: "/placeholder.svg?height=200&width=400",
    description: "Comfortable express bus service with onboard amenities.",
    features: ["Air conditioning", "WiFi", "Refreshments", "Reclining seats"],
  },
  {
    name: "Luxury Coach",
    company: "Royal Coaches",
    route: "Nairobi - Kisumu",
    departure: "8:00 AM, 9:00 PM",
    duration: "6 hours",
    price: "KSh 2,000",
    image: "/placeholder.svg?height=200&width=400",
    description: "Premium coach service with extra comfort and amenities.",
    features: ["VIP seating", "Entertainment system", "Onboard toilet", "Meal service"],
  },
  {
    name: "Shuttle Service",
    company: "City Connect",
    route: "Nairobi - Nakuru",
    departure: "Every hour from 6:00 AM to 8:00 PM",
    duration: "2.5 hours",
    price: "KSh 800",
    image: "/placeholder.svg?height=200&width=400",
    description: "Frequent shuttle service for convenient intercity travel.",
    features: ["Frequent departures", "Comfortable seating", "Luggage allowance", "Quick service"],
  },
]

const airTransport = [
  {
    name: "Domestic Flight",
    airline: "Kenya Airways",
    route: "Nairobi - Mombasa",
    departure: "7:30 AM, 12:30 PM, 5:30 PM",
    duration: "1 hour",
    price: "From KSh 5,500",
    image: "/placeholder.svg?height=200&width=400",
    description: "Regular domestic flights connecting major cities.",
    features: ["Multiple daily flights", "15kg baggage allowance", "Online check-in", "Loyalty program"],
  },
  {
    name: "Regional Flight",
    airline: "Jambojet",
    route: "Nairobi - Kisumu",
    departure: "8:00 AM, 4:00 PM",
    duration: "45 minutes",
    price: "From KSh 4,500",
    image: "/placeholder.svg?height=200&width=400",
    description: "Affordable regional flights with good service.",
    features: ["Budget friendly", "10kg baggage allowance", "Quick boarding", "Reliable schedule"],
  },
  {
    name: "Charter Flight",
    airline: "Safari Air",
    route: "Custom destinations",
    departure: "On demand",
    duration: "Varies",
    price: "From KSh 25,000",
    image: "/placeholder.svg?height=200&width=400",
    description: "Private charter flights to any destination in East Africa.",
    features: ["Private service", "Flexible schedule", "Premium experience", "Direct flights"],
  },
]

const oceanTransport = [
  {
    name: "Ferry Service",
    company: "Kenya Ferry Services",
    route: "Mombasa - Likoni",
    departure: "Every 30 minutes, 24/7",
    duration: "10 minutes",
    price: "KSh 50 (pedestrian), KSh 200 (vehicle)",
    image: "/placeholder.svg?height=200&width=400",
    description: "Regular ferry service connecting Mombasa Island and the mainland.",
    features: ["Frequent service", "Vehicle transport", "Pedestrian access", "Essential service"],
  },
  {
    name: "Coastal Cruise",
    company: "Ocean Safaris",
    route: "Mombasa - Lamu",
    departure: "Twice weekly: Monday and Thursday at 9:00 AM",
    duration: "8 hours",
    price: "From KSh 3,500",
    image: "/placeholder.svg?height=200&width=400",
    description: "Scenic coastal cruise with stops at beautiful beaches.",
    features: ["Scenic views", "Onboard meals", "Entertainment", "Comfortable seating"],
  },
  {
    name: "Cargo Shipping",
    company: "East Africa Shipping",
    route: "Mombasa - Dar es Salaam",
    departure: "Weekly departures",
    duration: "2 days",
    price: "Contact for quote",
    image: "/placeholder.svg?height=200&width=400",
    description: "Reliable cargo shipping services along the East African coast.",
    features: ["Container shipping", "Bulk cargo", "Customs clearance", "Door-to-door service"],
  },
]

export default function TransportPage() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadTransport.map((transport, index) => (
              <Card
                key={index}
                className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
              >
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={transport.image || "/placeholder.svg"}
                    alt={transport.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 p-2 w-fit rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                    <Truck className="h-5 w-5 text-yellow-500" />
                  </div>
                  <CardTitle>{transport.name}</CardTitle>
                  <CardDescription>{transport.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{transport.route}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Departure: {transport.departure}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Duration: {transport.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        Price: {transport.price}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{transport.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Features:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {transport.features.map((feature, i) => (
                        <Badge key={i} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
        </TabsContent>

        <TabsContent value="air" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Air Transport</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {airTransport.map((transport, index) => (
              <Card
                key={index}
                className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
              >
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={transport.image || "/placeholder.svg"}
                    alt={transport.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                    <Plane className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle>{transport.name}</CardTitle>
                  <CardDescription>{transport.airline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{transport.route}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Departure: {transport.departure}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Duration: {transport.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Price: {transport.price}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{transport.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Features:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {transport.features.map((feature, i) => (
                        <Badge key={i} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
        </TabsContent>

        <TabsContent value="ocean" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Ocean Transport</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {oceanTransport.map((transport, index) => (
              <Card
                key={index}
                className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
              >
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={transport.image || "/placeholder.svg"}
                    alt={transport.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 p-2 w-fit rounded-md bg-gradient-to-br from-yellow-100 to-blue-100 dark:from-yellow-900/30 dark:to-blue-900/30">
                    <Ship className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{transport.name}</CardTitle>
                  <CardDescription>{transport.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{transport.route}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Departure: {transport.departure}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Duration: {transport.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">Price: {transport.price}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{transport.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Features:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {transport.features.map((feature, i) => (
                        <Badge key={i} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
