"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  UserPlus,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { trpc } from "@/lib/trpc/client"
import { useAdminStore } from "@/stores/admin-store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { UserRole } from "@prisma/client"
import Link from "next/link"

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Admin store
  const { userFilters, setUserFilters, setCurrentSection } = useAdminStore()

  // Set current section for sidebar highlighting
  useEffect(() => {
    setCurrentSection("users")
  }, [setCurrentSection])

  // Fetch users
  const {
    data: usersData,
    isLoading,
    refetch,
  } = trpc.admin.users.getUsers.useQuery({
    limit: userFilters.limit,
    search: userFilters.search || undefined,
    role: (userFilters.role as UserRole) || undefined,
    sortBy: "createdAt",
    sortDirection: "desc",
  })

  // Fetch role counts
  const { data: roleCountData } = trpc.admin.users.getUserRolesCount.useQuery()

  // Delete user mutation
  const deleteUserMutation = trpc.admin.users.deleteUser.useMutation({
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
        variant: "default",
      })
      refetch()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsDeleting(null)
    },
  })

  // Handle delete user
  const handleDeleteUser = (id: string) => {
    setIsDeleting(id)
    deleteUserMutation.mutate({ id })
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setUserFilters({
      search: "",
      role: null,
    })
  }

  // Calculate pagination
  const totalPages = Math.ceil((usersData?.users.length || 0) / userFilters.limit)
  const currentPage = userFilters.page

  // Handle page change
  const handlePageChange = (page: number) => {
    setUserFilters({ page })
  }

  // Format role for display
  const formatRole = (role: UserRole) => {
    switch (role) {
      case UserRole.USER:
        return "User"
      case UserRole.CREATOR:
        return "Creator"
      case UserRole.ADMIN:
        return "Admin"
      case UserRole.SUPER_ADMIN:
        return "Super Admin"
      default:
        return role
    }
  }

  // Get role badge variant
  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.USER:
        return "outline"
      case UserRole.CREATOR:
        return "secondary"
      case UserRole.ADMIN:
        return "default"
      case UserRole.SUPER_ADMIN:
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        description="Manage user accounts and permissions"
        actions={
          <Link href="/admin/users/new">
            <Button className="gap-1">
              <UserPlus className="h-4 w-4" /> New User
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {roleCountData?.map((role) => (
          <Card key={role.role} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{formatRole(role.role)}</p>
                  <p className="text-2xl font-bold">{role.count}</p>
                </div>
                <Badge
                  variant={getRoleBadgeVariant(role.role)}
                  className="h-8 w-8 rounded-full flex items-center justify-center"
                >
                  {role.count}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9 bg-white/5 border-white/10"
                value={userFilters.search}
                onChange={(e) => setUserFilters({ search: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select
                value={userFilters.role || "all"}
                onValueChange={(value) => setUserFilters({ role: value === "all" ? null : value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 w-[180px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value={UserRole.USER}>User</SelectItem>
                  <SelectItem value={UserRole.CREATOR}>Creator</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                </SelectContent>
              </Select>

              {(userFilters.search || userFilters.role) && (
                <Button type="button" variant="ghost" size="icon" onClick={handleClearFilters} className="h-10 w-10">
                  <X className="h-4 w-4" />
                </Button>
              )}

              <Button type="submit" variant="outline" className="gap-1">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>
          </form>

          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow>
                  <TableHead className="w-[300px]">
                    <div className="flex items-center gap-1">
                      User
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Joined
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : usersData?.users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  usersData?.users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-white/5">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage
                              src={user.image || "/placeholder.svg?height=32&width=32"}
                              alt={user.name || "User"}
                            />
                            <AvatarFallback className="bg-primary text-xs">
                              {user.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="truncate">
                            <p className="font-medium truncate">{user.name || "Unnamed User"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>{formatRole(user.role)}</Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-500">
                            {user._count.posts} Posts
                          </Badge>
                          <Badge variant="outline" className="bg-purple-500/20 text-purple-500">
                            {user._count.tracks} Tracks
                          </Badge>
                          <Badge variant="outline" className="bg-green-500/20 text-green-500">
                            {user._count.articles} Articles
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass border-white/10">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                              className="hover:bg-white/5"
                              onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-white/5"
                              onClick={() => router.push(`/profile/${user.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                              className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isDeleting === user.id || user.role === UserRole.SUPER_ADMIN}
                            >
                              {isDeleting === user.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Trash className="h-4 w-4 mr-2" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{usersData?.users.length || 0}</span> results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className={`h-8 min-w-8 ${currentPage === i + 1 ? "bg-primary text-white" : ""}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

