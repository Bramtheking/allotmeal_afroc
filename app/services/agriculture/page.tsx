import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone } from "lucide-react"
import Link from "next/link"

const animals = [
  {
    name: "Dairy Cows",
    category: "Livestock",
    price: "From KSh 80,000",
    image: "/placeholder.svg?height=200&width=400",
    description: "High-yielding dairy cows for milk production.",
  },
  {
    name: "Merino Sheep",
    category: "Livestock",
    price: "From KSh 15,000",
    image: "/placeholder.svg?height=200&width=400",
    description: "Quality Merino sheep for wool and meat production.",
  },
  {
    name: "Kienyeji Chickens",
    category: "Poultry",
    price: "From KSh 800",
    image: "/placeholder.svg?height=200&width=400",
    description: "Free-range indigenous chickens for eggs and meat.",
  },
]

const products = [
  {
    name: "Maize Seeds (Hybrid)",
    category: "Seeds",
    price: "KSh 450 per kg",
    image: "/placeholder.svg?height=200&width=400",
    description: "High-yielding hybrid maize seeds suitable for various regions.",
  },
  {
    name: "Organic Fertilizer",
    category: "Fertilizers",
    price: "KSh 1,800 per 50kg",
    image: "/placeholder.svg?height=200&width=400",
    description: "100% organic fertilizer for improved soil health and crop yield.",
  },
  {
    name: "Fresh Vegetables Assortment",
    category: "Produce",
    price: "KSh 1,000 per basket",
    image: "/placeholder.svg?height=200&width=400",
    description: "Assorted fresh vegetables directly from farmers.",
  },
]

const structures = [
  {
    name: "Greenhouse Kit",
    size: "8m x 15m",
    price: "KSh 150,000",
    image: "/placeholder.svg?height=200&width=400",
    description: "Complete greenhouse kit with installation guide and materials.",
  },
  {
    name: "Poultry House",
    size: "5m x 10m",
    price: "KSh 85,000",
    image: "/placeholder.svg?height=200&width=400",
    description: "Modern poultry house design for 500 birds with feeding system.",
  },
  {
    name: "Water Tank",
    size: "5,000 Liters",
    price: "KSh 45,000",
    image: "/placeholder.svg?height=200&width=400",
    description: "Durable water storage tank for agricultural use.",
  },
]

export default function AgriculturePage() {
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
            {animals.map((animal, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={animal.image || "/placeholder.svg"}
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{animal.name}</CardTitle>
                  <CardDescription>{animal.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{animal.description}</p>
                  <p className="font-medium text-yellow-600 dark:text-yellow-400">{animal.price}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View Details</Button>
                  <Button>Purchase</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Agricultural Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
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
                  <CardDescription>{product.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{product.description}</p>
                  <p className="font-medium text-blue-600 dark:text-blue-400">{product.price}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View Details</Button>
                  <Button>Purchase</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="structures" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Agricultural Structures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {structures.map((structure, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={structure.image || "/placeholder.svg"}
                    alt={structure.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{structure.name}</CardTitle>
                  <CardDescription>Size: {structure.size}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{structure.description}</p>
                  <p className="font-medium text-yellow-600 dark:text-yellow-400">{structure.price}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View Details</Button>
                  <Button>Purchase</Button>
                </CardFooter>
              </Card>
            ))}
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
