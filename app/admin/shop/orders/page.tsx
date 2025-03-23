"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, X, ShoppingCart, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { useAdminStore } from "@/stores/admin-store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { OrderStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface OrderStatusData {
  status: OrderStatus
  count: number
}

export default function OrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  // Admin store
  const setCurrentSection = useAdminStore((state) => state.setCurrentSection)

  // Local state for filters
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    limit: 10,
    page: 1,
  })

  // Set current section for sidebar highlighting
  useEffect(() => {
    setCurrentSection("shop")
  }, [setCurrentSection])

  // Fetch orders
  const {
    data: ordersData,
    isLoading,
    refetch
  } = api.admin.shop.getOrders.useQuery({
    limit: filters.limit,
    search: filters.search || undefined,
    status: filters.status as OrderStatus || undefined,
    sortBy: "createdAt",
    sortDirection: "desc",
  })

  // Fetch shop stats
  const { data: shopStats } = api.admin.shop.getShopStats.useQuery()

  // Update order status mutation
  const updateOrderStatusMutation = api.admin.shop.updateOrderStatus.useMutation({
    onSuccess: () => {
      toast({
        title: "Order updated",
        description: "The order status has been successfully updated.",
        variant: "default",
      })
      refetch()
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update order. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsUpdating(null)
    }
  })

  // Handle update order status
  const handleUpdateOrderStatus = (id: string, status: OrderStatus) => {
    setIsUpdating(id)
    updateOrderStatusMutation.mutate({ id, status })
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      ...filters,
      search: "",
      status: "",
    })
  }

  // Calculate pagination
  const totalPages = Math.ceil((ordersData?.total || 0) / filters.limit)

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    })
  }

  // Format order status
  const formatOrderStatus = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "Pending"
      case OrderStatus.PAID:
        return "Paid"
      case OrderStatus.FULFILLED:
        return "Fulfilled"
      case OrderStatus.CANCELLED:
        return "Cancelled"
      case OrderStatus.REFUNDED:
        return "Refunded"
      default:
        return status
    }
  }

  // Get status badge variant
  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "outline"
      case OrderStatus.PAID:
        return "default"
      case OrderStatus.FULFILLED:
        return "secondary"
      case OrderStatus.CANCELLED:
        return "destructive"
      case OrderStatus.REFUNDED:
        return "outline"
      default:
        return "outline"
    }
  }

  // Get status icon
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <AlertCircle className="h-4 w-4" />
      case OrderStatus.PAID:
        return <CreditCard className="h-4 w-4" />
      case OrderStatus.FULFILLED:
        return <CheckCircle className="h-4 w-4" />
      case OrderStatus.CANCELLED:
        return <X className="h-4 w-4" />
      case OrderStatus.REFUNDED:
        return <CreditCard className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Orders"
        description="Manage customer orders and fulfillment"
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{shopStats?.totalOrders || 0}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {shopStats?.ordersByStatus.map((statusData: OrderStatusData) => (
          <Card key={statusData.status} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{formatOrderStatus(statusData.status)}</p>
                  <p className="text-2xl font-bold">{statusData.count}</p>
                </div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${statusData.status === OrderStatus.PENDING ? "bg-yellow-500/20" :
                  statusData.status === OrderStatus.PAID ? "bg-blue-500/20" :
                    statusData.status === OrderStatus.FULFILLED ? "bg-green-500/20" :
                      statusData.status === OrderStatus.CANCELLED ? "bg-red-500/20" :
                        "bg-purple-500/20"
                  }`}>
                  {getStatusIcon(statusData.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-9 bg-white/5 border-white/10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectValue value="">All Statuses</SelectValue>
                  {Object.values(OrderStatus).map((status) => (
                    <SelectValue key={status} value={status}>
                      {formatOrderStatus(status)}
                    </SelectValue>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </form>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : ordersData?.orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  ordersData?.orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.user.name}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {formatOrderStatus(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value as OrderStatus)}
                            disabled={isUpdating === order.id}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(OrderStatus).map((status) => (
                                <SelectValue key={status} value={status}>
                                  {formatOrderStatus(status)}
                                </SelectValue>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

