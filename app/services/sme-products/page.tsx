import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, ShoppingBag } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    name: "Cars",
    icon: "🚗",
    products: [
      {
        name: "Toyota Corolla",
        price: "KSh 1,500,000",
        image: "/placeholder.svg?height=200&width=400",
        description: "Well-maintained sedan with low mileage.",
      },
      {
        name: "Honda CRV",
        price: "KSh 2,200,000",
        image: "/placeholder.svg?height=200&width=400",
        description: "Spacious SUV with excellent fuel economy.",
      },
      {
        name: "Mazda CX-5",
        price: "KSh 2,800,000",
        image: "/placeholder.svg?height=200&width=400",
        description: "Stylish crossover with advanced safety features.",
      },
    ],
  },
  {
    name: "Clothing",
    icon: "👕",
    products: [
      {
        name: "African Print Dress",
        price: "KSh 3,500",
        image: "/placeholder.svg?height=200&width=400",
        description: "Handmade dress with traditional African prints.",
      },
      {
        name: "Men's Suit",
        price: "KSh 15,000",
        image: "/placeholder.svg?height=200&width=400",
        description: "Tailored suit made with high-quality fabric.",
      },
      {
        name: "Leather Sandals",
        price: "KSh 2,000",
        image: "/placeholder.svg?height=200&width=400",
        description: "Handcrafted leather sandals for everyday wear.",
      },
    ],
  },
  {
    name: "Furniture",
    icon: "🪑",
    products: [
      {
        name: "Wooden Dining Table",
        price: "KSh 45,000",
        image: "/placeholder.svg?height=200&width=400",
        description: "Handcrafted dining table made from solid mahogany.",
      },
      {
        name: "Leather Sofa Set",
        price: "KSh 120,000",
        image: "/placeholder.svg?height=200&width=400",
        description: "Elegant 5-seater sofa set with genuine leather upholstery.",
      },
      {
        name: "Bedroom Set",
        price: "KSh 85,000",
        image: "/placeholder.svg?height=200&width=400",
        description: "Complete bedroom set including bed frame, wardrobe, and side tables.",
      },
    ],
  },
  {
    name: "Software",
    icon: "💻",
    products: [
      {
        name: "Accounting Software",
        price: "KSh 25,000",
        image: "/placeholder.svg?height=200&width=400",
        description: "Comprehensive accounting solution for small businesses.",
      },
      {
        name: "Inventory Management System",
        price: "KSh 35,000",
        image: "/placeholder.svg?height=200&width=400",
        description: "Track and manage your inventory efficiently.",
      },
      {
        name: "E-commerce Website Package",
        price: "KSh 50,000",
        image: "/placeholder.svg?height=200&width=400",
        description: "Complete e-commerce solution with payment integration.",
      },
    ],
  },
]

export default function SMEProductsPage() {
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

      <Tabs defaultValue="cars" className="mb-12">
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
