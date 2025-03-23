"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PieChart, Activity, TrendingUp, Users, ShoppingCart, Radio, FileText, RefreshCw, Loader2 } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminMetricCard } from "@/components/admin/admin-metric-card"
import { AdminRecentActivity } from "@/components/admin/admin-recent-activity"
import { trpc } from "@/lib/trpc/client"
import { useAdminStore } from "@/stores/admin-store"
import { formatNumber } from "@/lib/utils"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart as RechartsBarChart,
} from "recharts"

export default function AdminDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const setCurrentSection = useAdminStore((state) => state.setCurrentSection)

  // Set current section for sidebar highlighting
  useEffect(() => {
    setCurrentSection("dashboard")
  }, [setCurrentSection])

  // Fetch dashboard data
  const { data: dashboardData, isLoading, refetch } = trpc.admin.dashboard.getMetrics.useQuery()
  const { data: userGrowthData } = trpc.admin.dashboard.getUserGrowthData.useQuery()
  const { data: contentData } = trpc.admin.dashboard.getContentData.useQuery()
  const { data: revenueData } = trpc.admin.dashboard.getRevenueData.useQuery()

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your platform's performance and activity"
        actions={
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminMetricCard
              title="Total Users"
              value={formatNumber(dashboardData?.metrics.userCount || 0)}
              change="+12%"
              trend="up"
              icon={Users}
              description="Total registered users"
            />
            <AdminMetricCard
              title="Active Listeners"
              value={formatNumber(dashboardData?.metrics.activeListeners || 0)}
              change="+8%"
              trend="up"
              icon={Radio}
              description="Users streaming music today"
            />
            <AdminMetricCard
              title="Revenue"
              value={`R ${dashboardData?.metrics.revenue.toFixed(2) || "0.00"}`}
              change="+15%"
              trend="up"
              icon={ShoppingCart}
              description="Total revenue this month"
            />
            <AdminMetricCard
              title="Content"
              value={formatNumber(dashboardData?.metrics.contentCount || 0)}
              change="+5%"
              trend="up"
              icon={FileText}
              description="Total tracks and articles"
            />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="glass mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-secondary" />
                      User Growth
                    </CardTitle>
                    <CardDescription>New user registrations over the past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {userGrowthData ? (
                        <ChartContainer
                          config={{
                            users: {
                              label: "New Users",
                              color: "hsl(var(--chart-1))",
                            },
                          }}
                          className="h-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart
                              data={userGrowthData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Legend />
                              <Line type="monotone" dataKey="count" stroke="var(--color-users)" name="New Users" />
                            </RechartsLineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-secondary" />
                      Popular Content
                    </CardTitle>
                    <CardDescription>Most streamed tracks and read articles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {contentData ? (
                        <ChartContainer
                          config={{
                            track: {
                              label: "Tracks",
                              color: "hsl(var(--chart-1))",
                            },
                            article: {
                              label: "Articles",
                              color: "hsl(var(--chart-2))",
                            },
                          }}
                          className="h-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={contentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Legend />
                              <Bar dataKey="count" stackId="type" fill="var(--color-track)" name="Tracks" />
                              <Bar dataKey="count" stackId="type" fill="var(--color-article)" name="Articles" />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-card md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <CardDescription>Latest actions across the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardData?.recentActivity ? (
                      <AdminRecentActivity activities={dashboardData.recentActivity} />
                    ) : (
                      <div className="flex items-center justify-center h-[220px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-secondary" />
                      User Demographics
                    </CardTitle>
                    <CardDescription>User distribution by region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[220px] flex items-center justify-center">
                      <PieChart className="h-48 w-48 text-muted-foreground opacity-50" />
                      <p className="absolute text-sm text-muted-foreground">Demographics chart will render here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage your platform users</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">User management interface will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Manage your platform content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Content management interface will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                  <CardDescription>Track your platform sales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {revenueData ? (
                      <ChartContainer
                        config={{
                          revenue: {
                            label: "Revenue",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" name="Revenue" />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

