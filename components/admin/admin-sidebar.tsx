"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  FileText,
  Music,
  Radio,
  ShoppingCart,
  MessageSquare,
  BarChart,
  Settings,
  ChevronDown,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAdminStore } from "@/stores/admin-store"

export function AdminSidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, setSidebarCollapsed, currentSection } = useAdminStore()

  const isActive = (path: string) => {
    return pathname === path
  }

  const isActiveSection = (section: string) => {
    return currentSection === section
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300",
        sidebarCollapsed && "w-20",
      )}
    >
      <div className="flex h-16 items-center border-b border-white/10 px-4">
        <Link href="/admin" className="flex items-center gap-2">
          {sidebarCollapsed ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">A</span>
          ) : (
            <>
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">A</span>
              <span className="font-bold">Amapiano.fm Admin</span>
            </>
          )}
        </Link>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <ChevronDown className={cn("h-5 w-5 transition-transform", sidebarCollapsed ? "rotate-90" : "rotate-270")} />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="flex flex-col gap-1">
          <Link href="/admin">
            <Button variant="ghost" className={cn("w-full justify-start gap-3", isActive("/admin") && "bg-white/10")}>
              <LayoutDashboard className="h-5 w-5" />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </Button>
          </Link>

          {/* Users Section */}
          <Collapsible defaultOpen={isActiveSection("users")} className="space-y-1">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-3", isActiveSection("users") && "bg-white/10")}
              >
                <Users className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">Users</span>
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", isActiveSection("users") && "rotate-180")}
                    />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("space-y-1 pl-8", sidebarCollapsed && "hidden")}>
              <Link href="/admin/users">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/users") && "bg-white/10")}
                >
                  All Users
                </Button>
              </Link>
              <Link href="/admin/users/roles">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/users/roles") && "bg-white/10")}
                >
                  Roles
                </Button>
              </Link>
              <Link href="/admin/users/permissions">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/users/permissions") && "bg-white/10")}
                >
                  Permissions
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Content Section */}
          <Collapsible defaultOpen={isActiveSection("content")} className="space-y-1">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-3", isActiveSection("content") && "bg-white/10")}
              >
                <FileText className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">Content</span>
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", isActiveSection("content") && "rotate-180")}
                    />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("space-y-1 pl-8", sidebarCollapsed && "hidden")}>
              <Link href="/admin/content/articles">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/content/articles") && "bg-white/10")}
                >
                  Articles
                </Button>
              </Link>
              <Link href="/admin/content/categories">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/content/categories") && "bg-white/10")}
                >
                  Categories
                </Button>
              </Link>
              <Link href="/admin/content/tags">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/content/tags") && "bg-white/10")}
                >
                  Tags
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Music Section */}
          <Collapsible defaultOpen={isActiveSection("music")} className="space-y-1">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-3", isActiveSection("music") && "bg-white/10")}
              >
                <Music className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">Music</span>
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", isActiveSection("music") && "rotate-180")}
                    />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("space-y-1 pl-8", sidebarCollapsed && "hidden")}>
              <Link href="/admin/music/tracks">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/music/tracks") && "bg-white/10")}
                >
                  Tracks
                </Button>
              </Link>
              <Link href="/admin/music/albums">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/music/albums") && "bg-white/10")}
                >
                  Albums
                </Button>
              </Link>
              <Link href="/admin/music/playlists">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/music/playlists") && "bg-white/10")}
                >
                  Playlists
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Radio Section */}
          <Collapsible defaultOpen={isActiveSection("radio")} className="space-y-1">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-3", isActiveSection("radio") && "bg-white/10")}
              >
                <Radio className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">Radio</span>
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", isActiveSection("radio") && "rotate-180")}
                    />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("space-y-1 pl-8", sidebarCollapsed && "hidden")}>
              <Link href="/admin/radio/shows">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/radio/shows") && "bg-white/10")}
                >
                  Shows
                </Button>
              </Link>
              <Link href="/admin/radio/episodes">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/radio/episodes") && "bg-white/10")}
                >
                  Episodes
                </Button>
              </Link>
              <Link href="/admin/radio/schedule">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/radio/schedule") && "bg-white/10")}
                >
                  Schedule
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Shop Section */}
          <Collapsible defaultOpen={isActiveSection("shop")} className="space-y-1">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-3", isActiveSection("shop") && "bg-white/10")}
              >
                <ShoppingCart className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">Shop</span>
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", isActiveSection("shop") && "rotate-180")}
                    />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("space-y-1 pl-8", sidebarCollapsed && "hidden")}>
              <Link href="/admin/shop/products">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/shop/products") && "bg-white/10")}
                >
                  Products
                </Button>
              </Link>
              <Link href="/admin/shop/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/shop/orders") && "bg-white/10")}
                >
                  Orders
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Community Section */}
          <Collapsible defaultOpen={isActiveSection("community")} className="space-y-1">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-3", isActiveSection("community") && "bg-white/10")}
              >
                <MessageSquare className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">Community</span>
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", isActiveSection("community") && "rotate-180")}
                    />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("space-y-1 pl-8", sidebarCollapsed && "hidden")}>
              <Link href="/admin/community/posts">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/community/posts") && "bg-white/10")}
                >
                  Posts
                </Button>
              </Link>
              <Link href="/admin/community/comments">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/community/comments") && "bg-white/10")}
                >
                  Comments
                </Button>
              </Link>
              <Link href="/admin/community/groups">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/community/groups") && "bg-white/10")}
                >
                  Groups
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Analytics Section */}
          <Collapsible defaultOpen={isActiveSection("analytics")} className="space-y-1">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-3", isActiveSection("analytics") && "bg-white/10")}
              >
                <BarChart className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">Analytics</span>
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", isActiveSection("analytics") && "rotate-180")}
                    />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("space-y-1 pl-8", sidebarCollapsed && "hidden")}>
              <Link href="/admin/analytics/overview">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/analytics/overview") && "bg-white/10")}
                >
                  Overview
                </Button>
              </Link>
              <Link href="/admin/analytics/users">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/analytics/users") && "bg-white/10")}
                >
                  User Analytics
                </Button>
              </Link>
              <Link href="/admin/analytics/content">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/analytics/content") && "bg-white/10")}
                >
                  Content Analytics
                </Button>
              </Link>
              <Link href="/admin/analytics/revenue">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", isActive("/admin/analytics/revenue") && "bg-white/10")}
                >
                  Revenue Analytics
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Settings */}
          <Link href="/admin/settings">
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-3", isActive("/admin/settings") && "bg-white/10")}
            >
              <Settings className="h-5 w-5" />
              {!sidebarCollapsed && <span>Settings</span>}
            </Button>
          </Link>
        </nav>
      </ScrollArea>

      <div className="border-t border-white/10 p-4">
        <Link href="/">
          <Button variant="outline" className="w-full gap-2">
            <Globe className="h-4 w-4" />
            {!sidebarCollapsed && <span>View Site</span>}
          </Button>
        </Link>
      </div>
    </div>
  )
}

