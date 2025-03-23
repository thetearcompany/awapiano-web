"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Save,
  Eye,
  Image,
  LucideLink,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Upload,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAdminStore } from "@/stores/admin-store"

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const setCurrentSection = useAdminStore((state) => state.setCurrentSection)

  // Set current section for sidebar highlighting
  useEffect(() => {
    setCurrentSection("content")
  }, [setCurrentSection])

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
    publishedAt: "",
    categoryId: "",
    tagIds: [] as string[],
  })

  // Fetch article data
  const { data: article, isLoading: isLoadingArticle } = api.admin.content.getArticleById.useQuery(
    { id: params.id },
    {
      onSuccess: (data) => {
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || "",
          content: data.content,
          coverImage: data.coverImage || "",
          published: data.published,
          publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().split("T")[0] : "",
          categoryId: data.categoryId || "",
          tagIds: data.tags.map((tag) => tag.id),
        })
      },
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to load article. Please try again.",
          variant: "destructive",
        })
        router.push("/admin/content/articles")
      },
    },
  )

  // Fetch categories and tags
  const { data: categories } = api.admin.content.getCategories.useQuery()
  const { data: tags } = api.admin.content.getTags.useQuery()

  // Update article mutation
  const updateArticleMutation = api.admin.content.updateArticle.useMutation({
    onSuccess: () => {
      toast({
        title: "Article updated",
        description: "The article has been successfully updated.",
        variant: "default",
      })
      router.push("/admin/content/articles")
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update article. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateArticleMutation.mutate({
      id: params.id,
      ...formData,
      publishedAt: formData.publishedAt ? new Date(formData.publishedAt) : undefined,
    })
  }

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

    setFormData((prev) => ({ ...prev, slug }))
  }

  if (isLoadingArticle) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Article"
        description="Update an existing blog article"
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/content/articles">
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
            <Button size="sm" variant="outline" className="gap-1" onClick={() => router.push(`/blog/${formData.slug}`)}>
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button size="sm" className="gap-1" onClick={handleSubmit} disabled={updateArticleMutation.isLoading}>
              {updateArticleMutation.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle>Article Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter article title..."
                      className="bg-white/5 border-white/10"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="slug">Slug</Label>
                      <Button type="button" variant="ghost" size="sm" onClick={generateSlug} className="h-6 text-xs">
                        Generate from title
                      </Button>
                    </div>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="article-slug"
                      className="bg-white/5 border-white/10"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                      title="Lowercase letters, numbers, and hyphens only. Cannot start or end with a hyphen."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      placeholder="Brief summary of the article..."
                      className="bg-white/5 border-white/10 resize-none h-20"
                      value={formData.excerpt}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Tabs defaultValue="write" className="w-full">
                      <TabsList className="glass mb-4">
                        <TabsTrigger value="write">Write</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                      </TabsList>

                      <TabsContent value="write" className="space-y-4">
                        <div className="flex flex-wrap gap-2 p-2 bg-white/5 rounded-md border border-white/10">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                            <Italic className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                            <Heading1 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                            <Heading2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                            <Heading3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                            <List className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                            <ListOrdered className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                            <LucideLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                            <Image className="h-4 w-4" />
                          </Button>
                        </div>

                        <Textarea
                          id="content"
                          name="content"
                          placeholder="Write your article content here..."
                          className="bg-white/5 border-white/10 min-h-[400px] resize-none"
                          value={formData.content}
                          onChange={handleChange}
                          required
                        />
                      </TabsContent>

                      <TabsContent value="preview">
                        <div className="p-4 bg-white/5 rounded-md border border-white/10 min-h-[400px] prose prose-invert max-w-none">
                          {formData.content ? (
                            <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, "<br>") }} />
                          ) : (
                            <p className="text-muted-foreground">Preview will appear here...</p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Image URL</Label>
                    <Input
                      id="coverImage"
                      name="coverImage"
                      placeholder="https://example.com/image.jpg"
                      className="bg-white/5 border-white/10"
                      value={formData.coverImage}
                      onChange={handleChange}
                    />
                  </div>

                  {formData.coverImage ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={formData.coverImage || "/placeholder.svg"}
                        alt="Cover preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center">
                      <div className="mx-auto flex flex-col items-center justify-center gap-2">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Drop your image here</h3>
                        <p className="text-sm text-muted-foreground mb-4">SVG, PNG, JPG or GIF (max. 2MB)</p>
                        <Button variant="outline" className="gap-1">
                          <Upload className="h-4 w-4" /> Upload Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      className="h-4 w-4 rounded border-white/20 bg-white/5"
                      checked={formData.published}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>

                  {formData.published && (
                    <div className="space-y-2">
                      <Label htmlFor="publishedAt">Publish Date</Label>
                      <Input
                        id="publishedAt"
                        name="publishedAt"
                        type="date"
                        className="bg-white/5 border-white/10"
                        value={formData.publishedAt}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => handleSelectChange("categoryId", value)}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="glass border-white/10">
                        <SelectItem value="none">Uncategorized</SelectItem>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-md min-h-[80px]">
                      {tags?.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No tags available</p>
                      ) : (
                        tags?.map((tag) => (
                          <div key={tag.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`tag-${tag.id}`}
                              className="h-4 w-4 rounded border-white/20 bg-white/5"
                              checked={formData.tagIds.includes(tag.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    tagIds: [...prev.tagIds, tag.id],
                                  }))
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    tagIds: prev.tagIds.filter((id) => id !== tag.id),
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor={`tag-${tag.id}`} className="text-sm">
                              {tag.name}
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input id="seoTitle" placeholder="SEO optimized title..." className="bg-white/5 border-white/10" />
                    <p className="text-xs text-muted-foreground">Defaults to the article title if left empty</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      placeholder="SEO meta description..."
                      className="bg-white/5 border-white/10 resize-none h-20"
                    />
                    <p className="text-xs text-muted-foreground">Defaults to the article excerpt if left empty</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

