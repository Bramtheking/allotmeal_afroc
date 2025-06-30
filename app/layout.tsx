import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AllotMeal Afroc Ltd Co. - Connecting Communities Across Africa",
  description:
    "Your premier platform for services, opportunities, and community connections across Africa. Find jobs, tenders, entertainment, education, health services, and more.",
  keywords:
    "Africa, services, jobs, tenders, entertainment, education, health, agriculture, construction, transport, SME products, hotel industry, sermon",
  authors: [{ name: "AllotMeal Afroc Ltd Co." }],
  creator: "AllotMeal Afroc Ltd Co.",
  publisher: "AllotMeal Afroc Ltd Co.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "AllotMeal Afroc Ltd Co. - Connecting Communities Across Africa",
    description: "Your premier platform for services, opportunities, and community connections across Africa.",
    url: "https://allotmeal-afroc.com",
    siteName: "AllotMeal Afroc Ltd Co.",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AllotMeal Afroc Ltd Co. - Connecting Communities Across Africa",
    description: "Your premier platform for services, opportunities, and community connections across Africa.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#f59e0b" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
