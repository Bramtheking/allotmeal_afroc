"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building, MapPin, Phone, PenToolIcon as Tool, Truck } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"

export default function ConstructionPage() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/services/construction")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const json = await response.json()
        setData(json)
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) return <div className="container py-32">Loading...</div>
  if (error) return <div className="container py-32">Error: {error.message}</div>

  const { buildingSites, roadProjects, constructionServices, constructionMaterials } = data

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buildingSites.map((site, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
                  >
                    <div className="aspect-video w-full bg-muted">
                      <img
                        src={site.image || "/placeholder.svg"}
                        alt={site.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="mb-2 p-2 w-fit rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                        <Building className="h-5 w-5 text-yellow-500" />
                      </div>
                      <CardTitle>{site.name}</CardTitle>
                      <CardDescription>
                        {site.type} • {site.status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{site.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Expected completion: {site.completion}</span>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{site.description}</p>
                      <div className="text-sm">
                        <p className="font-medium mb-1">Features:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {site.features.map((feature, i) => (
                            <Badge key={i} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
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
            </TabsContent>

            <TabsContent value="roads" className="pt-6">
              <h2 className="text-2xl font-semibold mb-6">Road Construction Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roadProjects.map((project, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                  >
                    <div className="aspect-video w-full bg-muted">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>
                        {project.type} • {project.status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{project.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Expected completion: {project.completion}</span>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{project.description}</p>
                      <div className="text-sm">
                        <p className="font-medium mb-1">Features:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.features.map((feature, i) => (
                            <Badge key={i} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
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
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Construction Supplies & Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {constructionMaterials.map((material, index) => (
              <Card
                key={index}
                className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
              >
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={material.image || "/placeholder.svg"}
                    alt={material.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 p-2 w-fit rounded-md bg-gradient-to-br from-yellow-100 to-blue-100 dark:from-yellow-900/30 dark:to-blue-900/30">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{material.name}</CardTitle>
                  <CardDescription>{material.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{material.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Available Items:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {material.items.map((item, i) => (
                        <Badge key={i} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View Catalog
                  </Button>
                  <Button className="flex-1">Request Quote</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Construction & Repair Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {constructionServices.map((service, index) => (
              <Card
                key={index}
                className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
              >
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                    <Tool className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{service.description}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Services Offered:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {service.services.map((item, i) => (
                        <Badge key={i} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View Services
                  </Button>
                  <Button className="flex-1">Hire Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Navigation Options</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline">Exit</Button>
          <Button variant="outline" asChild>
            <Link href="/#services">Go to Menu</Link>
          </Button>
          <Button variant="outline">WhatsApp (KSh 10/-)</Button>
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" /> Customer Care
          </Button>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/#services">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>
        </Button>
      </div>
    </div>
  )
}
