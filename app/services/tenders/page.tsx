"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"

export default function TendersPage() {
  const [tenders, setTenders] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) return

        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "tenders"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const tenderData: Service[] = []

        querySnapshot.forEach((doc) => {
          tenderData.push({ id: doc.id, ...doc.data() } as Service)
        })

        setTenders(tenderData)
      } catch (error) {
        console.error("Error fetching tenders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTenders()
  }, [])

  const getTendersByType = (type: string) => {
    return tenders.filter((tender) => tender.tenderType?.toLowerCase() === type.toLowerCase())
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading tenders...</span>
        </div>
      </div>
    )
  }

  const privateTenders = getTendersByType("private")
  const publicTenders = getTendersByType("public")

  return (
    <div className="container py-32">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/#services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">Tenders</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Access private and public tender opportunities for business growth and expansion. Browse available tenders and
        submit your bids through our platform.
      </p>

      <Tabs defaultValue="private" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="private">Private Jobs</TabsTrigger>
          <TabsTrigger value="public">Public Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="private" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Private Tender Opportunities</h2>
          {privateTenders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl font-semibold mb-2">No private tenders available at the moment</p>
              <p className="text-muted-foreground">Check back later for new business opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {privateTenders.map((tender) => (
                <Card
                  key={tender.id}
                  className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all"
                >
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                      <FileText className="h-5 w-5 text-yellow-500" />
                    </div>
                    <CardTitle>{tender.title}</CardTitle>
                    <CardDescription>
                      {tender.company} • {tender.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {tender.budget && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Budget:</span>
                          <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                            {tender.budget}
                          </span>
                        </div>
                      )}
                      {tender.deadline && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Deadline:</span>
                          <span className="text-sm font-medium">{new Date(tender.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm mb-3">{tender.description}</p>
                    {tender.requirements && tender.requirements.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Requirements:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {tender.requirements.slice(0, 3).map((req, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/services/tenders/${tender.id}`}>Apply for Tender</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="public" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Public Tender Opportunities</h2>
          {publicTenders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏛️</div>
              <p className="text-xl font-semibold mb-2">No public tenders available at the moment</p>
              <p className="text-muted-foreground">Check back later for new government opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {publicTenders.map((tender) => (
                <Card
                  key={tender.id}
                  className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                >
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-md bg-blue-100 dark:bg-blue-900/30">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{tender.title}</CardTitle>
                    <CardDescription>
                      {tender.agency || tender.company} • {tender.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {tender.budget && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Budget:</span>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{tender.budget}</span>
                        </div>
                      )}
                      {tender.deadline && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Deadline:</span>
                          <span className="text-sm font-medium">{new Date(tender.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm mb-3">{tender.description}</p>
                    {tender.requirements && tender.requirements.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Requirements:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {tender.requirements.slice(0, 3).map((req, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/services/tenders/${tender.id}`}>Apply for Tender</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Navigation Options</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline">Exit</Button>
          <Button variant="outline" asChild>
            <Link href="/#services">Back to Menu</Link>
          </Button>
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" /> Contact Customer Care
          </Button>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/#services">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>
        </Button>
        <Button variant="outline">WhatsApp Support</Button>
      </div>
    </div>
  )
}
