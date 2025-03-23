import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserProfile {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  location?: string
  website?: string
  followersCount: number
  followingCount: number
  postsCount: number
}

interface UserState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  setProfile: (profile: UserProfile | null) => void
  updateProfile: (data: Partial<UserProfile>) => void
  clearError: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: false,
      error: null,
      setProfile: (profile) => set({ profile }),
      updateProfile: (data) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...data } : null,
        })),
      clearError: () => set({ error: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ profile: state.profile }),
    },
  ),
)

