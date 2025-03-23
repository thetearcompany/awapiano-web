"use client"

import { useEffect, useState } from "react"
import { useCommunityStore } from "@/stores/community-store"
import { useUserStore } from "@/stores/user-store"
import { trpc } from "@/lib/trpc/client"
import { CommunityFeed } from "./components/community-feed"
import { CreatePostForm } from "./components/create-post-form"
import { UserProfileCard } from "./components/user-profile-card"
import { PopularGroupsList } from "./components/popular-groups-list"
import { TrendingTopicsList } from "./components/trending-topics-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobileDetect } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function CommunityContainer() {
  const [activeTab, setActiveTab] = useState<"trending" | "latest" | "following">("trending")
  const [activeSidebarTab, setActiveSidebarTab] = useState<"profile" | "groups" | "topics">("profile")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isMobile = useMobileDetect()

  const {
    posts,
    popularGroups,
    trendingTopics,
    setPosts,
    addPosts,
    setPopularGroups,
    setTrendingTopics,
    addPost,
    updatePost,
    isLoading,
    setLoading,
    error,
    setError,
  } = useCommunityStore()

  const { profile } = useUserStore()

  // Fetch posts
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPostsPage,
    refetch: refetchPosts,
  } = trpc.community.getPosts.useInfiniteQuery(
    {
      type: activeTab,
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: true,
    },
  )

  // Fetch popular groups
  const { data: groupsData, refetch: refetchGroups } = trpc.community.getPopularGroups.useQuery(
    { limit: 5 },
    { enabled: true },
  )

  // Fetch trending topics
  const { data: topicsData, refetch: refetchTopics } = trpc.community.getTrendingTopics.useQuery(
    { limit: 5 },
    { enabled: true },
  )

  // Create post mutation
  const createPostMutation = trpc.community.createPost.useMutation({
    onSuccess: (data) => {
      if (data.success && data.post) {
        // Add the new post to the store
        addPost({
          id: data.post.id,
          content: data.post.content,
          mediaUrl: data.post.mediaUrl,
          mediaType: data.post.mediaType,
          user: {
            id: profile?.id || "",
            name: profile?.name || "User",
            username: profile?.email?.split("@")[0] || "user",
            image: profile?.image || "/placeholder.svg?height=40&width=40",
          },
          createdAt: "Just now",
          likes: 0,
          comments: 0,
          shares: 0,
        })
      }
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  // Like post mutation
  const likePostMutation = trpc.community.likePost.useMutation({
    onSuccess: (data, variables) => {
      if (data.success) {
        // Update the post in the store
        updatePost(variables.postId, {
          likes: posts.find((p) => p.id === variables.postId)?.likes || 0 + 1,
        })
      }
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  // Unlike post mutation
  const unlikePostMutation = trpc.community.unlikePost.useMutation({
    onSuccess: (data, variables) => {
      if (data.success) {
        // Update the post in the store
        updatePost(variables.postId, {
          likes: Math.max(0, (posts.find((p) => p.id === variables.postId)?.likes || 1) - 1),
        })
      }
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  // Create comment mutation
  const createCommentMutation = trpc.community.createComment.useMutation({
    onSuccess: (data, variables) => {
      if (data.success && data.comment) {
        // In a real app, we would update the post with the new comment
        // For now, we'll just increment the comment count
        updatePost(variables.postId, {
          comments: (posts.find((p) => p.id === variables.postId)?.comments || 0) + 1,
        })
      }
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  // Update store when data is fetched
  useEffect(() => {
    if (postsData?.pages[0]) {
      const allPosts = postsData.pages.flatMap((page) => page.posts)
      setPosts(allPosts)
    }
  }, [postsData, setPosts])

  useEffect(() => {
    if (groupsData) {
      setPopularGroups(groupsData)
    }
  }, [groupsData, setPopularGroups])

  useEffect(() => {
    if (topicsData) {
      setTrendingTopics(topicsData)
    }
  }, [topicsData, setTrendingTopics])

  // Update loading state
  useEffect(() => {
    setLoading(isLoadingPosts)
  }, [isLoadingPosts, setLoading])

  // Handle tab change
  const handleTabChange = (tab: "trending" | "latest" | "following") => {
    setActiveTab(tab)
  }

  // Handle create post
  const handleCreatePost = (content: string, mediaUrl?: string, mediaType?: "image" | "audio" | "link") => {
    createPostMutation.mutate({
      content,
      mediaUrl,
      mediaType,
    })
  }

  // Handle like post
  const handleLikePost = (postId: string) => {
    likePostMutation.mutate({ postId })
  }

  // Handle unlike post
  const handleUnlikePost = (postId: string) => {
    unlikePostMutation.mutate({ postId })
  }

  // Handle create comment
  const handleCreateComment = (postId: string, content: string) => {
    createCommentMutation.mutate({
      postId,
      content,
    })
  }

  // Handle load more posts
  const handleLoadMorePosts = () => {
    if (hasNextPostsPage) {
      fetchNextPosts()
    }
  }

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([refetchPosts(), refetchGroups(), refetchTopics()])
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs hover:bg-white/5 transition-colors"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
        >
          <RefreshCw className={cn("h-3 w-3 mr-1", isRefreshing && "animate-spin")} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Mobile Sidebar Tabs */}
      {isMobile && (
        <Tabs
          defaultValue="profile"
          value={activeSidebarTab}
          onValueChange={(value) => setActiveSidebarTab(value as "profile" | "groups" | "topics")}
          className="w-full mb-2"
        >
          <TabsList className="glass w-full">
            <TabsTrigger value="profile" className="text-xs flex-1">
              Profile
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs flex-1">
              Groups
            </TabsTrigger>
            <TabsTrigger value="topics" className="text-xs flex-1">
              Topics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 animate-fade-in">
            <UserProfileCard profile={profile} />
          </TabsContent>

          <TabsContent value="groups" className="mt-4 animate-fade-in">
            <PopularGroupsList groups={popularGroups} />
          </TabsContent>

          <TabsContent value="topics" className="mt-4 animate-fade-in">
            <TrendingTopicsList topics={trendingTopics} />
          </TabsContent>
        </Tabs>
      )}

      {/* Desktop Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Left Sidebar - Only visible on desktop */}
        {!isMobile && (
          <div className="md:col-span-1 space-y-6">
            <UserProfileCard profile={profile} />
            <PopularGroupsList groups={popularGroups} />
            <TrendingTopicsList topics={trendingTopics} />
          </div>
        )}

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <CreatePostForm onSubmit={handleCreatePost} isLoading={createPostMutation.isLoading} />

          {error && (
            <div className="bg-accent/10 text-accent p-3 rounded-lg text-sm flex items-center justify-between animate-fade-in">
              <p>{error}</p>
              <Button variant="ghost" size="sm" className="h-6 px-2 hover:bg-accent/20" onClick={() => setError(null)}>
                Dismiss
              </Button>
            </div>
          )}

          <CommunityFeed
            posts={posts}
            activeTab={activeTab}
            isLoading={isLoading}
            hasMore={!!hasNextPostsPage}
            onTabChange={handleTabChange}
            onLikePost={handleLikePost}
            onUnlikePost={handleUnlikePost}
            onCreateComment={handleCreateComment}
            onLoadMore={handleLoadMorePosts}
          />
        </div>
      </div>
    </div>
  )
}

// Helper function for class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

