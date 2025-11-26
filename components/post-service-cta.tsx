"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, ArrowRight, CheckCircle2 } from "lucide-react"
import { PostServiceDialog } from "./post-service-dialog"

export function PostServiceCTA() {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <div className="relative mt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-orange-400/20 rounded-3xl blur-3xl" />
        <Card className="relative border-2 border-purple-200/50 dark:border-purple-800/30 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl" />
          
          <CardHeader className="relative text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Megaphone className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Want Your Service Featured Here?
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Reach thousands of potential customers across Africa by listing your service on our platform
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Wide Reach</h4>
                  <p className="text-sm text-muted-foreground">
                    Get your service in front of thousands of active users
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Easy Setup</h4>
                  <p className="text-sm text-muted-foreground">
                    Simple payment process and instant service activation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Verified Listing</h4>
                  <p className="text-sm text-muted-foreground">
                    Your contact details are automatically verified
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={() => setShowDialog(true)}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Megaphone className="mr-3 h-6 w-6" />
                Post Your Service Now
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Pricing varies by service category • Secure M-Pesa payment • Instant activation
            </p>
          </CardContent>
        </Card>
      </div>

      <PostServiceDialog isOpen={showDialog} onClose={() => setShowDialog(false)} />
    </>
  )
}
