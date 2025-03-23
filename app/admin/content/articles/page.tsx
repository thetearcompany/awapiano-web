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
  Plus,
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
} from "lucide-react"
import Link from "next/link"
import { trpc } from "@/lib/trpc/client"
import { useAdminStore } from "@/stores/admin-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ArticlesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Admin store
  const { articleFilters, setArticleFilters, setCurrentSection } = useAdminStore()

  // Set current section for sidebar highlighting
  useEffect(() => {
    setCurrentSection("content")
  }, [setCurrentSection])

  // Fetch articles
  const {
    data: articlesData,
    isLoading,
    refetch,
  } = trpc.admin.content.getArticles.useQuery({
    limit: articleFilters.limit,
    search: articleFilters.search || undefined,
    categoryId: articleFilters.categoryId || undefined,
    published: articleFilters.published === null ? undefined : articleFilters.published,
  })

  // Fetch categories for filter
  const { data: categories } = trpc.admin.content.getCategories.useQuery()

  // Delete article mutation
  const deleteArticleMutation = trpc.admin.content.deleteArticle.useMutation({
    onSuccess: () => {
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted.",
        variant: "default",
      })
      refetch()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete article. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsDeleting(null)
    },
  })

  // Handle delete article
  const handleDeleteArticle = (id: string) => {
    setIsDeleting(id)
    deleteArticleMutation.mutate({ id })
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setArticleFilters({
      search: "",
      categoryId: null,
      published: null,
    })
  }

  // Calculate pagination
  const totalPages = Math.ceil((articlesData?.articles.length || 0) / articleFilters.limit)
  const currentPage = articleFilters.page

  // Handle page change
  const handlePageChange = (page: number) => {
    setArticleFilters({ page })
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Articles"
        description="Manage blog articles and content"
        actions={
          <Link href="/admin/content/articles/new">
            <Button className="gap-1">
              <Plus className="h-4 w-4" /> New Article
            </Button>
          </Link>
        }
      />

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle>All Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-9 bg-white/5 border-white/10"
                value={articleFilters.search}
                onChange={(e) => setArticleFilters({ search: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select
                value={articleFilters.categoryId || ""}
                onValueChange={(value) => setArticleFilters({ categoryId: value || null })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={articleFilters.published === null ? "" : articleFilters.published.toString()}
                onValueChange={(value) => {
                  let published = null
                  if (value === "true") published = true
                  if (value === "false") published = false
                  setArticleFilters({ published })
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/10 w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="true">Published</SelectItem>
                  <SelectItem value="false">Draft</SelectItem>
                </SelectContent>
              </Select>

              {(articleFilters.search || articleFilters.categoryId || articleFilters.published !== null) && (
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
                  <TableHead className="w-[400px]">
                    <div className="flex items-center gap-1">
                      Title
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
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
                ) : articlesData?.articles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No articles found
                    </TableCell>
                  </TableRow>
                ) : (
                  articlesData?.articles.map((article) => (
                    <TableRow key={article.id} className="hover:bg-white/5">
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>{article.category?.name || "Uncategorized"}</TableCell>
                      <TableCell>{article.author?.name || "Unknown"}</TableCell>
                      <TableCell>{new Date(article.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            article.published
                              ? "bg-green-500/20 text-green-500 hover:bg-green-500/30 hover:text-green-500"
                              : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 hover:text-yellow-500"
                          }
                        >
                          {article.published ? "Published" : "Draft"}
                        </Badge>
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
                              onClick={() => router.push(`/admin/content/articles/edit/${article.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-white/5"
                              onClick={() => router.push(`/blog/${article.slug}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                              className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                              onClick={() => handleDeleteArticle(article.id)}
                              disabled={isDeleting === article.id}
                            >
                              {isDeleting === article.id ? (
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
              Showing <span className="font-medium">{articlesData?.articles.length || 0}</span> results
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

