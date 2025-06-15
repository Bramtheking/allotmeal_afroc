"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Product {
  name: string
  price: string
  image: string
  description: string
}

interface Category {
  name: string
  icon: string
  products: Product[]
}

export default function SMEProductsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/services/sme-products")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setCategories(data)
        setLoading(false)
      } catch (e: any) {
        setError(e.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="container py-32">Loading products...</div>
  }

  if (error) {
    return <div className="container py-32">Error: {error}</div>
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

      <Tabs defaultValue={categories.length > 0 ? categories[0].name.toLowerCase() : ""} className="mb-12">
        <TabsList className="mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.name} value={category.name.toLowerCase()} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">{category.name} Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.products.map((product, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription className="text-lg font-medium text-yellow-600 dark:text-yellow-400">
                      {product.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{product.description}</p>
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
          </TabsContent>
        ))}
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
