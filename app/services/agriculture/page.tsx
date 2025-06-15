"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Service {
  id: string
  title: string
  category: string
  subcategory?: string
  price: string
  image?: string
  description: string
  features?: string[]
  location?: string
}

export default function AgriculturePage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/agriculture`)
      if (!response.ok) throw new Error("Failed to fetch services")
      const data = await response.json()
      setServices(data.services || [])
    } catch (err) {
      setError("Failed to load services")
      console.error("Error fetching services:", err)
    } finally {
      setLoading(false)
    }
  }

  const getServicesBySubcategory = (subcategory: string) => {
    return services.filter((service) => service.subcategory === subcategory)
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading agriculture services...</p>
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
            <Button onClick={fetchServices}>Try Again</Button>
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
        <h1 className="text-3xl md:text-4xl font-bold">Agriculture</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Connect with agricultural products, livestock, and farming structures for sustainable growth. Browse our
        selection of animals, agricultural products, and structures.
      </p>

      <Tabs defaultValue="animals" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="animals">Animals & Birds</TabsTrigger>
          <TabsTrigger value="products">Agri Products</TabsTrigger>
          <TabsTrigger value="structures">Agri Structures</TabsTrigger>
        </TabsList>

        <TabsContent value="animals" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Animals & Birds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getServicesBySubcategory("animals").length > 0 ? (
              getServicesBySubcategory("animals").map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    <img
                      src={service.image || "/placeholder.svg?height=200&width=400"}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{service.description}</p>
                    <p className="font-medium text-yellow-600 dark:text-yellow-400">{service.price}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Details</Button>
                    <Button>Purchase</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No animals & birds available at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Agricultural Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getServicesBySubcategory("products").length > 0 ? (
              getServicesBySubcategory("products").map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    <img
                      src={service.image || "/placeholder.svg?height=200&width=400"}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{service.description}</p>
                    <p className="font-medium text-blue-600 dark:text-blue-400">{service.price}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Details</Button>
                    <Button>Purchase</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No agricultural products available at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="structures" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Agricultural Structures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getServicesBySubcategory("structures").length > 0 ? (
              getServicesBySubcategory("structures").map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    <img
                      src={service.image || "/placeholder.svg?height=200&width=400"}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{service.description}</p>
                    <p className="font-medium text-yellow-600 dark:text-yellow-400">{service.price}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Details</Button>
                    <Button>Purchase</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No agricultural structures available at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Payment Options</h3>
        <p className="mb-4">
          You can pay for agricultural products using various payment methods including M-Pesa, credit cards, and bank
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
