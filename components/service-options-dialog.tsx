"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import Link from "next/link"

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

export function ServiceOptionsDialog({ isOpen, onClose, serviceType }: ServiceOptionsDialogProps) {
  const IconComponent = serviceIcons[serviceType as keyof typeof serviceIcons] || Building2
  const colorGradient = serviceColors[serviceType as keyof typeof serviceColors] || "from-gray-500 to-gray-600"
  const serviceTitle = serviceTitles[serviceType as keyof typeof serviceTitles] || "Service"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
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
                Choose an option
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <Link href={`/services/${serviceType}`} onClick={onClose}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">Continue</CardTitle>
                    <CardDescription className="text-sm">
                      Browse all available services in this category
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ml-auto" />
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <Link href={`/services/${serviceType}/videos`} onClick={onClose}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">Videos</CardTitle>
                    <CardDescription className="text-sm">View videos and media content</CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ml-auto" />
                </div>
              </CardHeader>
            </Link>
          </Card>
        </div>

        <div className="pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
