"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, Search, X, Home, Radio, ShoppingBag, BookOpen, Users, Music } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  // Navigation items with icons for mobile
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Radio", href: "/radio", icon: Radio },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Community", href: "/community", icon: Users },
    { name: "Talent", href: "/talent", icon: Music },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)

    // Initial check
    handleScroll()
    handleOnlineStatus()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }, [pathname])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  return (
    <>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="offline-indicator animate-pulse-subtle">You are offline. Some features may be limited.</div>
      )}

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "glass py-2" : "bg-transparent py-3 md:py-4",
          !isOnline && "mt-6",
        )}
      >
        <div className="container max-w-4xl mx-auto px-3 md:px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover-scale z-10">
            <div className="relative h-8 w-8 md:h-10 md:w-10 rounded-full sa-flag-gradient flex items-center justify-center">
              <span className="text-black font-bold text-base md:text-lg">A</span>
            </div>
            <span
              className={cn(
                "font-bold text-lg md:text-xl transition-opacity duration-300",
                isSearchOpen && "opacity-0 md:opacity-100",
              )}
            >
              Amapiano.fm
            </span>
          </Link>

          {/* Mobile Search Input */}
          <div
            className={cn(
              "absolute left-0 right-0 px-3 transition-all duration-300 flex items-center",
              isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <div className="relative flex-1 mx-12">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search..."
                className="pl-9 pr-9 py-2 h-9 bg-white/10 border-white/10 focus:border-secondary"
                onKeyDown={(e) => e.key === "Escape" && setIsSearchOpen(false)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "font-medium transition-colors relative group",
                  pathname === item.href ? "text-secondary" : "hover:text-secondary",
                )}
              >
                {item.name}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300",
                    pathname === item.href ? "w-full" : "w-0 group-hover:w-full",
                  )}
                ></span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/5 transition-colors"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent animate-pulse-subtle"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-0 hover:bg-white/5 transition-colors">
                  <Avatar className="h-8 w-8 hover-scale">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback className="bg-primary">SA</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-white/5 animate-fade-in">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="hover:bg-white/5 transition-colors">Profile</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/5 transition-colors">Settings</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/5 transition-colors">My Mixes</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="hover:bg-white/5 transition-colors">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 hover:bg-white/5 transition-colors"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass absolute top-full left-0 right-0 border-t border-white/5 py-3 animate-slide-in">
            <nav className="container max-w-4xl mx-auto px-4 flex flex-col gap-3">
              {navItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "font-medium py-3 flex items-center gap-3 hover:text-secondary transition-colors",
                      pathname === item.href ? "text-secondary" : "",
                      "animate-slide-in",
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
              <div
                className="flex items-center gap-3 py-3 border-t border-white/5 mt-2 animate-slide-in"
                style={{ animationDelay: "0.3s" }}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback className="bg-primary">SA</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">User Name</p>
                  <p className="text-xs text-muted-foreground">View Profile</p>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

