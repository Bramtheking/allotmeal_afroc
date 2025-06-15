"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, User, LogOut, Settings, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { AuthDialog } from "@/components/auth/auth-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const isMobile = useMobile()
  const { user, logout, loading } = useAuth()

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

  const openAuthDialog = (mode: "login" | "register") => {
    setAuthMode(mode)
    setAuthDialogOpen(true)
  }

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const getUserInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm" : "bg-transparent",
        )}
      >
        <div className="container flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-bold gradient-text">Allotmeal Afroc</span>
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

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.firstName} />
                      <AvatarFallback className="gradient-bg text-white">
                        {getUserInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {user.role.replace("_", " ")}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === "admin" || user.role === "content_manager") && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => openAuthDialog("login")}>
                  Sign In
                </Button>
                <Button className="gradient-bg" onClick={() => openAuthDialog("register")}>
                  Sign Up
                </Button>
              </div>
            )}
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

            {user ? (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.firstName} />
                    <AvatarFallback className="gradient-bg text-white">
                      {getUserInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
                  </div>
                </div>
                <Link href="/profile" className="block text-lg font-medium" onClick={toggleMenu}>
                  Profile
                </Link>
                <Link href="/settings" className="block text-lg font-medium" onClick={toggleMenu}>
                  Settings
                </Link>
                {(user.role === "admin" || user.role === "content_manager") && (
                  <Link href="/admin" className="block text-lg font-medium" onClick={toggleMenu}>
                    Admin Panel
                  </Link>
                )}
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    openAuthDialog("login")
                    toggleMenu()
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full gradient-bg"
                  onClick={() => {
                    openAuthDialog("register")
                    toggleMenu()
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} defaultMode={authMode} />
    </>
  )
}
