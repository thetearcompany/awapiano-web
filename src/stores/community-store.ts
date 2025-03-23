import { create } from "zustand"

export interface Post {
  id: string
  content: string
  mediaUrl?: string
  mediaType?: "image" | "audio" | "link"
  user: {
    id: string
    name: string
    username: string
    image: string
  }
  createdAt: string
  likes: number
  comments: number
  shares: number
  commentsList?: any[]
}

interface CommunityState {
  posts: Post[]
  postDetails: any | null
  popularGroups: any[]
  trendingTopics: string[]
  isLoading: boolean
  error: string | null

  // Actions
  setPosts: (posts: Post[]) => void
  addPosts: (posts: Post[]) => void
  setPostDetails: (details: any) => void
  setPopularGroups: (groups: any[]) => void
  setTrendingTopics: (topics: string[]) => void
  addPost: (post: Post) => void
  updatePost: (postId: string, data: Partial<Post>) => void
  removePost: (postId: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useCommunityStore = create<CommunityState>((set) => ({
  posts: [],
  postDetails: null,
  popularGroups: [],
  trendingTopics: [],
  isLoading: false,
  error: null,

  setPosts: (posts) => set({ posts }),

  addPosts: (posts) =>
    set((state) => ({
      posts: [...state.posts, ...posts],
    })),

  setPostDetails: (details) => set({ postDetails: details }),

  setPopularGroups: (groups) => set({ popularGroups: groups }),

  setTrendingTopics: (topics) => set({ trendingTopics: topics }),

  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  updatePost: (postId, data) =>
    set((state) => ({
      posts: state.posts.map((post) => (post.id === postId ? { ...post, ...data } : post)),
    })),

  removePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}))

