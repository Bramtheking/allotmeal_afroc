"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Eye,
  Video,
  Building2,
  Briefcase,
  Hammer,
  Wheat,
  Music,
  Package,
  FileText,
  GraduationCap,
  Heart,
  Truck,
  Church,
  ArrowRight,
  MapPin,
  Search,
} from "lucide-react"
import { useRouter } from "next/navigation"
// import { MpesaPaymentDialog } from "./mpesa-payment-dialog" // No longer needed - payment disabled

interface ServiceOptionsDialogProps {
  isOpen: boolean
  onClose: () => void
  serviceType: string
}

const serviceIcons = {
  "hotel-industry": Building2,
  jobs: Briefcase,
  construction: Hammer,
  agriculture: Wheat,
  entertainment: Music,
  "sme-products": Package,
  tenders: FileText,
  education: GraduationCap,
  health: Heart,
  transport: Truck,
  sermon: Church,
}

const serviceColors = {
  "hotel-industry": "from-amber-500 to-orange-500",
  jobs: "from-emerald-500 to-teal-500",
  construction: "from-orange-500 to-red-500",
  agriculture: "from-green-500 to-lime-500",
  entertainment: "from-purple-500 to-pink-500",
  "sme-products": "from-indigo-500 to-purple-500",
  tenders: "from-slate-600 to-gray-700",
  education: "from-cyan-500 to-teal-500",
  health: "from-rose-500 to-pink-500",
  transport: "from-yellow-500 to-orange-500",
  sermon: "from-violet-500 to-purple-600",
}

const serviceTitles = {
  "hotel-industry": "Hotel & Industry",
  jobs: "Jobs",
  construction: "Construction",
  agriculture: "Agriculture",
  entertainment: "Entertainment",
  "sme-products": "SME Products",
  tenders: "Tenders",
  education: "Education",
  health: "Health",
  transport: "Transport",
  sermon: "Sermon",
}

const africanCountries = [
  "Kenya"
]

export function ServiceOptionsDialog({ isOpen, onClose, serviceType }: ServiceOptionsDialogProps) {
  const router = useRouter()
  const [step, setStep] = useState<"country" | "action">("country")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [countrySearch, setCountrySearch] = useState("")
  // const [paymentDialogOpen, setPaymentDialogOpen] = useState(false) // No longer needed - payment disabled
  // const [selectedAction, setSelectedAction] = useState<"Continue" | "Videos">("Continue") // No longer needed - payment disabled

  const IconComponent = serviceIcons[serviceType as keyof typeof serviceIcons] || Building2
  const colorGradient = serviceColors[serviceType as keyof typeof serviceColors] || "from-gray-500 to-gray-600"
  const serviceTitle = serviceTitles[serviceType as keyof typeof serviceTitles] || "Service"

  const filteredCountries = africanCountries.filter(country =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country)
    setStep("action")
  }

  const handleClose = () => {
    setStep("country")
    setSelectedCountry("")
    setCountrySearch("")
    onClose()
  }

  const handleActionClick = (action: "Continue" | "Videos") => {
    // PAYMENT DISABLED - Direct navigation to services or videos
    handleClose()

    // Navigate directly to service page without payment
    const url = action === "Continue"
      ? `/services/${serviceType}`
      : `/services/${serviceType}/videos`

    router.push(url)
  }

  // const handlePaymentSuccess = () => { // Removed as payment is disabled
  //   setPaymentDialogOpen(false)
  //   handleClose()

  //   // Navigate to service page (country selection is just for show, filtering done manually)
  //   const url = selectedAction === "Continue" 
  //     ? `/services/${serviceType}`
  //     : `/services/${serviceType}/videos`

  //   router.push(url)
  // }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorGradient} flex items-center justify-center text-white shadow-lg`}
              >
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">{serviceTitle}</DialogTitle>
                <Badge variant="secondary" className="mt-1">
                  {step === "country" ? "Select Country" : "Choose Action"}
                </Badge>
              </div>
            </div>
            {step === "country" && (
              <DialogDescription>
                Select your country to view relevant services
              </DialogDescription>
            )}
          </DialogHeader>

          {step === "country" ? (
            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Country Grid */}
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-2">
                  {filteredCountries.map((country) => (
                    <Button
                      key={country}
                      variant="outline"
                      className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary/50 transition-all text-gray-900 dark:text-gray-100"
                      onClick={() => handleCountrySelect(country)}
                    >
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{country}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" onClick={handleClose} className="w-full bg-transparent">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected Country Badge */}
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{selectedCountry}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("country")}
                  className="ml-auto h-7 text-xs"
                >
                  Change
                </Button>
              </div>

              {/* Action Cards */}
              <Card
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
                onClick={() => handleActionClick("Continue")}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">Continue</CardTitle>
                      <CardDescription className="text-sm">
                        Browse all available services in {selectedCountry}
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ml-auto" />
                  </div>
                </CardHeader>
              </Card>

              <Card
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
                onClick={() => handleActionClick("Videos")}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">Videos</CardTitle>
                      <CardDescription className="text-sm">View videos from {selectedCountry}</CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ml-auto" />
                  </div>
                </CardHeader>
              </Card>

              <div className="pt-4 border-t">
                <Button variant="outline" onClick={handleClose} className="w-full bg-transparent">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment dialog removed - direct access enabled */}
    </>
  )
}
