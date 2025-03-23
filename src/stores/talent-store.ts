import { create } from "zustand"

export interface Submission {
  id: string
  title: string
  type: "mix" | "original" | "remix"
  artist: {
    id: string
    name: string
    image: string
  }
  duration: string
  date: string
  image: string
  likes: number
  comments: number
  downloads: number
  rating: number
}

export interface SpotlightArtist {
  id: string
  name: string
  location: string
  image: string
  bio: string
  rating: number
  ratingCount: number
  featuredTrack: {
    id: string
    title: string
    duration: string
    releaseDate: string
  }
}

interface TalentState {
  spotlightArtist: SpotlightArtist | null
  submissions: Submission[]
  topRated: any[]
  submissionDetails: any | null
  isLoading: boolean
  error: string | null

  // Actions
  setSpotlightArtist: (artist: SpotlightArtist) => void
  setSubmissions: (submissions: Submission[]) => void
  addSubmissions: (submissions: Submission[]) => void
  setTopRated: (topRated: any[]) => void
  setSubmissionDetails: (details: any) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useTalentStore = create<TalentState>((set) => ({
  spotlightArtist: null,
  submissions: [],
  topRated: [],
  submissionDetails: null,
  isLoading: false,
  error: null,

  setSpotlightArtist: (artist) => set({ spotlightArtist: artist }),

  setSubmissions: (submissions) => set({ submissions }),

  addSubmissions: (submissions) =>
    set((state) => ({
      submissions: [...state.submissions, ...submissions],
    })),

  setTopRated: (topRated) => set({ topRated }),

  setSubmissionDetails: (details) => set({ submissionDetails: details }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}))

