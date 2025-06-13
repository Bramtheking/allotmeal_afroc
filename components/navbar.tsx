"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 md:h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
              Allotmeal Afroc
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/#services" className="text-sm font-medium transition-colors hover:text-primary">
            Services
          </Link>
          <Link href="/#about" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/#contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
          <ThemeToggle />
          <Button className="bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700">
            Get Started
          </Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-md p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top">
          <Link href="/" className="text-lg font-medium transition-colors hover:text-primary" onClick={toggleMenu}>
            Home
          </Link>
          <Link
            href="/#services"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={toggleMenu}
          >
            Services
          </Link>
          <Link
            href="/#about"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            href="/#contact"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          <Button className="w-full bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700">
            Get Started
          </Button>
        </div>
      )}
    </header>
  )
}
