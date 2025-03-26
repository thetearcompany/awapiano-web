import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated and has admin role
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/admin")
  }

  // In a real app, you would check for admin role
  // This is a simplified check based on email domain
  const isAdmin = session.user?.email?.endsWith("@amapiano.fm") || session.user?.email === "admin@example.com"

  if (!isAdmin) {
    redirect("/unauthorized")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 pt-16 flex flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6 bg-black/95 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>

      <Footer />
    </div>
  )
}

