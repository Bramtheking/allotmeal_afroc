"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"

export default function AgriculturePage() {
  const [agriculture, setAgriculture] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgriculture = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) return

        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "agriculture"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const agricultureData: Service[] = []

        querySnapshot.forEach((doc) => {
          agricultureData.push({ id: doc.id, ...doc.data() } as Service)
        })

        setAgriculture(agricultureData)
      } catch (error) {
        console.error("Error fetching agriculture:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgriculture()
  }, [])

  const getAgricultureByCategory = (category: string) => {
    return agriculture.filter((item) => item.category?.toLowerCase() === category.toLowerCase())
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading agriculture...</span>
        </div>
      </div>
    )
  }

  const animals = getAgricultureByCategory("animals")
  const products = getAgricultureByCategory("products")
  const structures = getAgricultureByCategory("structures")

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
          {animals.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🐄</div>
              <p className="text-xl font-semibold mb-2">No animals available at the moment</p>
              <p className="text-muted-foreground">Check back later for new livestock listings!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animals.map((animal) => (
                <Card key={animal.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    {animal.images && animal.images.length > 0 ? (
                      <img
                        src={animal.images[0] || "/placeholder.svg"}
                        alt={animal.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{animal.title}</CardTitle>
                    <CardDescription>{animal.animalType || animal.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{animal.description}</p>
                    {animal.price && <p className="font-medium text-yellow-600 dark:text-yellow-400">{animal.price}</p>}
                    {animal.location && <p className="text-sm text-muted-foreground mt-2">📍 {animal.location}</p>}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Details</Button>
                    <Button>Purchase</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Agricultural Products</h2>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌾</div>
              <p className="text-xl font-semibold mb-2">No agricultural products available at the moment</p>
              <p className="text-muted-foreground">Check back later for fresh produce and supplies!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                    <CardDescription>{product.productType || product.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{product.description}</p>
                    {product.price && <p className="font-medium text-blue-600 dark:text-blue-400">{product.price}</p>}
                    {product.quantity && <p className="text-sm text-muted-foreground">Quantity: {product.quantity}</p>}
                    {product.location && <p className="text-sm text-muted-foreground">📍 {product.location}</p>}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Details</Button>
                    <Button>Purchase</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="structures" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Agricultural Structures</h2>
          {structures.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏗️</div>
              <p className="text-xl font-semibold mb-2">No agricultural structures available at the moment</p>
              <p className="text-muted-foreground">Check back later for farming equipment and structures!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {structures.map((structure) => (
                <Card key={structure.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    {structure.images && structure.images.length > 0 ? (
                      <img
                        src={structure.images[0] || "/placeholder.svg"}
                        alt={structure.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{structure.title}</CardTitle>
                    <CardDescription>{structure.structureSize && `Size: ${structure.structureSize}`}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{structure.description}</p>
                    {structure.price && (
                      <p className="font-medium text-yellow-600 dark:text-yellow-400">{structure.price}</p>
                    )}
                    {structure.location && (
                      <p className="text-sm text-muted-foreground mt-2">📍 {structure.location}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Details</Button>
                    <Button>Purchase</Button>
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
