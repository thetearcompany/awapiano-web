"use client"

import { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"

export default function NewArticlePage() {
  const [articleStatus, setArticleStatus] = useState("draft")

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Create New Article"
        description="Write and publish a new blog article"
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/content/articles">
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
            <Button size="sm" variant="outline" className="gap-1">
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button size="sm" className="gap-1">
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        }
      />

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
                  <Input id="title" placeholder="Enter article title..." className="bg-white/5 border-white/10" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of the article..."
                    className="bg-white/5 border-white/10 resize-none h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
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
                        placeholder="Write your article content here..."
                        className="bg-white/5 border-white/10 min-h-[400px] resize-none"
                      />
                    </TabsContent>

                    <TabsContent value="preview">
                      <div className="p-4 bg-white/5 rounded-md border border-white/10 min-h-[400px]">
                        <p className="text-muted-foreground">Preview will appear here...</p>
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
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={articleStatus} onValueChange={setArticleStatus}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {articleStatus === "scheduled" && (
                  <div className="space-y-2">
                    <Label htmlFor="publishDate">Publish Date</Label>
                    <Input id="publishDate" type="datetime-local" className="bg-white/5 border-white/10" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue="feature">
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Select defaultValue="sarah-adams">
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      <SelectItem value="sarah-adams">Sarah Adams</SelectItem>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="producer-x">Producer X</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="Separate tags with commas..." className="bg-white/5 border-white/10" />
                  <p className="text-xs text-muted-foreground">Example: Amapiano, South Africa, DJ Maphorisa</p>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    placeholder="SEO meta description..."
                    className="bg-white/5 border-white/10 resize-none h-20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

