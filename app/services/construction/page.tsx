"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building, MapPin, Phone, PenToolIcon as Tool, Truck, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"

export default function ConstructionPage() {
  const [construction, setConstruction] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConstruction = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) return

        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "construction"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const constructionData: Service[] = []

        querySnapshot.forEach((doc) => {
          constructionData.push({ id: doc.id, ...doc.data() } as Service)
        })

        setConstruction(constructionData)
      } catch (error) {
        console.error("Error fetching construction:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConstruction()
  }, [])

  const getConstructionByCategory = (category: string) => {
    return construction.filter((item) => item.category?.toLowerCase() === category.toLowerCase())
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading construction...</span>
        </div>
      </div>
    )
  }

  const buildingSites = getConstructionByCategory("building")
  const roadProjects = getConstructionByCategory("road")
  const constructionMaterials = getConstructionByCategory("materials")
  const constructionServices = getConstructionByCategory("services")

  return (
    <div className="container py-32">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/#services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">Construction & Repairs</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Access construction sites, materials, equipment, and professional services. Find everything you need for your
        construction and repair projects.
      </p>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-8">
        <p className="text-sm">Service charge: KSh 20/- (charged by Safaricom)</p>
      </div>

      <Tabs defaultValue="sites" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="sites">Sites/Location</TabsTrigger>
          <TabsTrigger value="materials">Supplies & Materials</TabsTrigger>
          <TabsTrigger value="services">Services Available</TabsTrigger>
        </TabsList>

        <TabsContent value="sites" className="space-y-6">
          <Tabs defaultValue="buildings" className="mb-8">
            <TabsList>
              <TabsTrigger value="buildings">Buildings</TabsTrigger>
              <TabsTrigger value="roads">Roads</TabsTrigger>
            </TabsList>

            <TabsContent value="buildings" className="pt-6">
              <h2 className="text-2xl font-semibold mb-6">Building Construction Sites</h2>
              {buildingSites.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏗️</div>
                  <p className="text-xl font-semibold mb-2">No building sites available at the moment</p>
                  <p className="text-muted-foreground">Check back later for new construction projects!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {buildingSites.map((site) => (
                    <Card
                      key={site.id}
                      className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
                    >
                      <div className="aspect-video w-full bg-muted">
                        {site.images && site.images.length > 0 ? (
                          <img
                            src={site.images[0] || "/placeholder.svg"}
                            alt={site.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-muted-foreground">No image</span>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <div className="mb-2 p-2 w-fit rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                          <Building className="h-5 w-5 text-yellow-500" />
                        </div>
                        <CardTitle>{site.title}</CardTitle>
                        <CardDescription>
                          {site.projectType || site.category} • {site.projectStatus || "Active"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          {site.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{site.location}</span>
                            </div>
                          )}
                          {site.completionDate && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                Expected completion: {new Date(site.completionDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm mb-3">{site.description}</p>
                        {site.features && site.features.length > 0 && (
                          <div className="text-sm">
                            <p className="font-medium mb-1">Features:</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {site.features.slice(0, 3).map((feature, i) => (
                                <Badge key={i} variant="outline">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                        <Button className="flex-1">Contact Developer</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="roads" className="pt-6">
              <h2 className="text-2xl font-semibold mb-6">Road Construction Projects</h2>
              {roadProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛣️</div>
                  <p className="text-xl font-semibold mb-2">No road projects available at the moment</p>
                  <p className="text-muted-foreground">Check back later for new infrastructure projects!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roadProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                    >
                      <div className="aspect-video w-full bg-muted">
                        {project.images && project.images.length > 0 ? (
                          <img
                            src={project.images[0] || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-muted-foreground">No image</span>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                          <Truck className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>
                          {project.projectType || project.category} • {project.projectStatus || "Active"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          {project.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{project.location}</span>
                            </div>
                          )}
                          {project.completionDate && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                Expected completion: {new Date(project.completionDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm mb-3">{project.description}</p>
                        {project.features && project.features.length > 0 && (
                          <div className="text-sm">
                            <p className="font-medium mb-1">Features:</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.features.slice(0, 3).map((feature, i) => (
                                <Badge key={i} variant="outline">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                        <Button className="flex-1">Contact Contractor</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Construction Supplies & Materials</h2>
          {constructionMaterials.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧱</div>
              <p className="text-xl font-semibold mb-2">No construction materials available at the moment</p>
              <p className="text-muted-foreground">Check back later for new building supplies!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {constructionMaterials.map((material) => (
                <Card
                  key={material.id}
                  className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="aspect-video w-full bg-muted">
                    {material.images && material.images.length > 0 ? (
                      <img
                        src={material.images[0] || "/placeholder.svg"}
                        alt={material.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-gradient-to-br from-yellow-100 to-blue-100 dark:from-yellow-900/30 dark:to-blue-900/30">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{material.title}</CardTitle>
                    <CardDescription>{material.materialType || material.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{material.description}</p>
                    {material.price && <p className="text-sm font-medium text-primary mb-2">Price: {material.price}</p>}
                    {material.quantity && (
                      <p className="text-sm text-muted-foreground mb-2">Available: {material.quantity}</p>
                    )}
                    {material.specifications && material.specifications.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Specifications:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {material.specifications.slice(0, 3).map((spec, i) => (
                            <Badge key={i} variant="outline">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button className="flex-1">Order Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Construction Services Available</h2>
          {constructionServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔨</div>
              <p className="text-xl font-semibold mb-2">No construction services available at the moment</p>
              <p className="text-muted-foreground">Check back later for new service providers!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {constructionServices.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="aspect-video w-full bg-muted">
                    {service.images && service.images.length > 0 ? (
                      <img
                        src={service.images[0] || "/placeholder.svg"}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                      <Tool className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.serviceCategory || service.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{service.description}</p>
                    {service.price && (
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                        Price: {service.price}
                      </p>
                    )}
                    {service.location && (
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{service.location}</span>
                      </div>
                    )}
                    {service.specializations && service.specializations.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Specializations:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {service.specializations.slice(0, 3).map((spec, i) => (
                            <Badge key={i} variant="outline">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Portfolio
                    </Button>
                    <Button className="flex-1">Hire Service</Button>
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
          You can pay for construction services using various payment methods including M-Pesa, credit cards, and bank
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
