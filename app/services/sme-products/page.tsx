"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Phone,
  ShoppingBag,
  Loader2,
  Store,
  DollarSign,
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Award,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const categories = [
  { name: "cars", label: "Cars", icon: ShoppingBag, color: "from-cyan-500 to-teal-500" },
  { name: "clothing", label: "Clothing", icon: ShoppingBag, color: "from-teal-500 to-cyan-500" },
  { name: "furniture", label: "Furniture", icon: ShoppingBag, color: "from-slate-500 to-teal-500" },
  { name: "software", label: "Software", icon: ShoppingBag, color: "from-blue-500 to-cyan-500" },
]

export default function SMEProductsPage() {
  const [products, setProducts] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("cars")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          console.log("[v0] Firebase not available - no SME products to display")
          setProducts([])
          setLoading(false)
          return
        }

        console.log("[v0] Fetching SME products from Firebase...")
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

        console.log("[v0] Successfully fetched SME products from database:", productData.length)
        setProducts(productData)
      } catch (error) {
        console.error("[v0] Error fetching SME products:", error)
        setProducts([])
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-cyan-950/20 dark:via-gray-950 dark:to-teal-950/20">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <span className="text-lg font-medium bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Loading premium products...
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-cyan-950/20 dark:via-gray-950 dark:to-teal-950/20">
      {/* Hero Section with Product Search */}
      <div className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-teal-400/20 to-blue-500/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="container relative py-20">
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="outline"
              size="icon"
              asChild
              className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30"
            >
              <Link href="/#services">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              SME Products &
              <br />
              <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Discover premium products from Africa's innovative small and medium enterprises. Quality goods,
              competitive prices, direct from manufacturers.
            </p>
          </motion.div>

          {/* Product Search Box */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Product Category</label>
                  <div className="relative">
                    <ShoppingBag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-500" />
                    <select className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-cyan-400 bg-white">
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Brand or Product</label>
                  <div className="relative">
                    <ShoppingBag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-500" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="pl-10 h-12 border-gray-200 focus:border-teal-400 w-full rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Price Range</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                    <select className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-blue-400 bg-white">
                      <option value="">Any Price</option>
                      <option value="0-100">$0 - $100</option>
                      <option value="100-500">$100 - $500</option>
                      <option value="500+">$500+</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <Button className="flex-1 h-12 text-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Products
                </Button>
                <Button variant="outline" className="md:w-auto h-12 border-gray-300 hover:bg-gray-50 bg-transparent">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-20">
        {/* Featured Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Premium SME Products
            </h2>
            <p className="text-xl text-gray-900 dark:text-gray-300 max-w-3xl mx-auto">
              Support local businesses while getting quality products at competitive prices
            </p>
          </div>

          {products.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-cyan-900/20 dark:to-teal-900/20 flex items-center justify-center">
                <ShoppingBag className="h-20 w-20 text-cyan-500" />
              </div>
              <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Exciting SME Products Coming Soon
              </h3>
              <p className="text-lg text-gray-900 dark:text-white max-w-md mx-auto mb-8">
                We're partnering with Africa's top SME manufacturers and suppliers. Check back soon for quality products
                at competitive prices!
              </p>
              <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-lg px-8 py-3">
                Notify Me When Available
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-500 border-0 h-full">
                    <div className="relative">
                      <div className="aspect-square w-full overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center">
                            <ShoppingBag className="h-16 w-16 text-cyan-500" />
                          </div>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="absolute top-3 left-3">
                        <Badge className="bg-green-500 text-white">In Stock</Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-cyan-600 dark:text-cyan-400 line-clamp-2">
                        {product.title}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-gray-900 ml-1">(4.8)</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 flex-1">
                      <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{product.description}</p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-cyan-600">{product.price || "$299"}</span>
                        </div>
                        <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
                          Premium
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-gray-900">
                        <Store className="h-4 w-4 text-teal-500" />
                        <span className="text-sm">{product.company || "Premium SME"}</span>
                      </div>
                    </CardContent>

                    <CardFooter className="grid grid-cols-2 gap-2 pt-4">
                      <Button variant="outline" size="sm" className="border-cyan-200 hover:bg-cyan-50 bg-transparent">
                        <Heart className="mr-1 h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
                      >
                        <Link href={`/services/sme-products/${product.id}`}>
                          <ShoppingCart className="mr-1 h-4 w-4" />
                          Buy
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Why Choose Our SME Marketplace */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-cyan-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Quality Assured</h3>
            <p className="text-gray-900 leading-relaxed">
              All products are quality-checked and come with manufacturer warranties.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-teal-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Fast Delivery</h3>
            <p className="text-gray-900 leading-relaxed">
              Quick and reliable shipping directly from local SME partners.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-cyan-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Support SMEs</h3>
            <p className="text-gray-900 leading-relaxed">
              Every purchase supports African small businesses and local economies.
            </p>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-teal-400/20 to-cyan-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-3xl border border-cyan-100 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Ready to Shop Premium SME Products?
            </h3>
            <p className="text-lg text-gray-900 mb-8 max-w-2xl mx-auto">
              Discover quality products from innovative African businesses and enjoy competitive prices with fast
              delivery.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                className="h-14 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 px-8 text-lg"
                asChild
              >
                <a href="tel:+254701524543">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: +254 701 524543
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="h-14 border-cyan-200 hover:bg-cyan-50 px-8 text-lg"
                asChild
              >
                <a href="mailto:allotmealafrockenya@gmail.com">
                  ✉️ Email Support
                </a>
              </Button>
              <Button 
                className="h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 text-lg"
                asChild
              >
                <a href="https://wa.me/254701524543" target="_blank" rel="noopener noreferrer">
                  💬 WhatsApp Chat
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

