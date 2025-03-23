"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type { Post } from "@/stores/community-store"
import { PostItem } from "./post-item"
import { Loader2 } from "lucide-react"

interface CommunityFeedProps {
  posts: Post[]
  activeTab: "trending" | "latest" | "following"
  isLoading: boolean
  hasMore: boolean
  onTabChange: (tab: "trending" | "latest" | "following") => void
  onLikePost: (postId: string) => void
  onUnlikePost: (postId: string) => void
  onCreateComment: (postId: string, content: string) => void
  onLoadMore: () => void
}

export function CommunityFeed({
  posts,
  activeTab,
  isLoading,
  hasMore,
  onTabChange,
  onLikePost,
  onUnlikePost,
  onCreateComment,
  onLoadMore,
}: CommunityFeedProps) {
  return (
    <Tabs
      defaultValue={activeTab}
      value={activeTab}
      onValueChange={(value) => onTabChange(value as "trending" | "latest" | "following")}
      className="w-full"
    >
      <TabsList className="glass mb-6">
        <TabsTrigger value="trending">Trending</TabsTrigger>
        <TabsTrigger value="latest">Latest</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="mt-0 space-y-6">
        {isLoading && posts.length === 0 ? (
          <Card className="glass-card p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </Card>
        ) : posts.length === 0 ? (
          <Card className="glass-card p-8 text-center">
            <h3 className="text-xl font-bold mb-2">No posts found</h3>
            <p>Be the first to post in this section!</p>
          </Card>
        ) : (
          <>
            {posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onLike={() => onLikePost(post.id)}
                onUnlike={() => onUnlikePost(post.id)}
                onComment={(content) => onCreateComment(post.id, content)}
              />
            ))}

            {hasMore && (
              <Button
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10"
                onClick={onLoadMore}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            )}
          </>
        )}
      </TabsContent>
    </Tabs>
  )
}

