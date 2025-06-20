"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User, Settings, LogOut, Shield, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "./theme-toggle"
import { motion } from "framer-motion"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, userRole, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Hide navbar on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  if (isAuthPage) return null

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleNavClick = () => {
    setIsOpen(false)
  }

  const getDashboardLink = () => {
    if (userRole === "admin") return "/dashboard/admin"
    if (userRole === "marketing") return "/dashboard/marketing"
    return "/dashboard"
  }

  return (
    <motion.nav
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="h-8 w-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-white font-bold text-sm">A</span>
            </motion.div>
            <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              AllotMeAfroc
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary relative ${
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
              {pathname === item.href && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500"
                  layoutId="navbar-indicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                    <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">Role: {userRole}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()}>
                    {userRole === "admin" ? (
                      <Shield className="mr-2 h-4 w-4" />
                    ) : userRole === "marketing" ? (
                      <BarChart3 className="mr-2 h-4 w-4" />
                    ) : (
                      <User className="mr-2 h-4 w-4" />
                    )}
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex md:items-center md:space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center space-x-2" onClick={handleNavClick}>
                    <div className="h-8 w-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      AllotMeAfroc
                    </span>
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>

                <div className="flex flex-col space-y-3 pt-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleNavClick}
                      className={`text-sm font-medium transition-colors hover:text-primary px-2 py-1 rounded ${
                        pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {user ? (
                  <div className="flex flex-col space-y-3 pt-4 border-t">
                    <div className="flex items-center space-x-3 px-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user.displayName || "User"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">Role: {userRole}</p>
                      </div>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      onClick={handleNavClick}
                      className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary px-2 py-1 rounded transition-colors"
                    >
                      {userRole === "admin" ? (
                        <Shield className="h-4 w-4" />
                      ) : userRole === "marketing" ? (
                        <BarChart3 className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={handleNavClick}
                      className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary px-2 py-1 rounded transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        handleNavClick()
                      }}
                      className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary px-2 py-1 rounded transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <Button variant="ghost" asChild onClick={handleNavClick}>
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button
                      asChild
                      onClick={handleNavClick}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  )
}

export { Navbar }
export default Navbar
