import { create } from "zustand"

export interface Article {
  id: string
  title: string
  category: string
  date: string
  readTime: string
  image: string
  excerpt: string
  isNew?: boolean
  author?: {
    id: string
    name: string
    role: string
    image: string
  }
}

interface ContentState {
  featuredArticle: Article | null
  latestArticles: Article[]
  categories: { id: string; name: string }[]
  tags: string[]
  isLoading: boolean
  error: string | null

  // Actions
  setFeaturedArticle: (article: Article) => void
  setLatestArticles: (articles: Article[]) => void
  addArticles: (articles: Article[]) => void
  setCategories: (categories: { id: string; name: string }[]) => void
  setTags: (tags: string[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useContentStore = create<ContentState>((set) => ({
  featuredArticle: null,
  latestArticles: [],
  categories: [],
  tags: [],
  isLoading: false,
  error: null,

  setFeaturedArticle: (article) => set({ featuredArticle: article }),

  setLatestArticles: (articles) => set({ latestArticles: articles }),

  addArticles: (articles) =>
    set((state) => ({
      latestArticles: [...state.latestArticles, ...articles],
    })),

  setCategories: (categories) => set({ categories }),

  setTags: (tags) => set({ tags }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}))

