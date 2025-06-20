"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, ShoppingBag, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"

const categories = [
  { name: "cars", label: "Cars", icon: "🚗" },
  { name: "clothing", label: "Clothing", icon: "👕" },
  { name: "furniture", label: "Furniture", icon: "🪑" },
  { name: "software", label: "Software", icon: "💻" },
]

export default function SMEProductsPage() {
  const [products, setProducts] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("cars")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) return

        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "sme-products"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const productData: Service[] = []

        querySnapshot.forEach((doc) => {
          productData.push({ id: doc.id, ...doc.data() } as Service)
        })

        setProducts(productData)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getProductsByCategory = (category: string) => {
    return products.filter((product) => product.category?.toLowerCase() === category.toLowerCase())
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading products...</span>
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
        <h1 className="text-3xl md:text-4xl font-bold">SME Products</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Discover a wide range of products from small and medium enterprises across various sectors. Support local
        businesses and find quality products at competitive prices.
      </p>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-12">
        <TabsList className="mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category.name} value={category.name}>
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category.name)

          return (
            <TabsContent key={category.name} value={category.name} className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">{category.label} Products</h2>
              {categoryProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <p className="text-xl font-semibold mb-2">
                    No {category.label.toLowerCase()} products available at the moment
                  </p>
                  <p className="text-muted-foreground">
                    Check back later for new {category.label.toLowerCase()} listings!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((product) => (
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
                        <CardDescription className="text-lg font-medium text-yellow-600 dark:text-yellow-400">
                          {product.price}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{product.description}</p>
                        {product.location && (
                          <p className="text-sm text-muted-foreground mt-2">📍 {product.location}</p>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">View Details</Button>
                        <Button>
                          <ShoppingBag className="mr-2 h-4 w-4" /> Buy Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Payment Options</h3>
        <p className="mb-4">
          You can pay for SME products using various payment methods including M-Pesa, credit cards, and bank transfers.
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
