import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AllotMeal Afroc - Your Gateway to African Opportunities",
  description:
    "Discover services, opportunities, and connections across Africa with AllotMeal Afroc. From agriculture to entertainment, find what you need.",
  keywords:
    "Africa, services, opportunities, agriculture, entertainment, jobs, education, health, transport, construction",
  authors: [{ name: "AllotMeal Afroc Ltd Co." }],
  creator: "AllotMeal Afroc Ltd Co.",
  publisher: "AllotMeal Afroc Ltd Co.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "AllotMeal Afroc - Your Gateway to African Opportunities",
    description: "Discover services, opportunities, and connections across Africa with AllotMeal Afroc.",
    url: "https://allotmealafroc.com",
    siteName: "AllotMeal Afroc",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AllotMeal Afroc - Your Gateway to African Opportunities",
    description: "Discover services, opportunities, and connections across Africa with AllotMeal Afroc.",
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
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
