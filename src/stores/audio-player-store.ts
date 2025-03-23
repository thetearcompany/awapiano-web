import { create } from "zustand"

export interface Track {
  id: string
  title: string
  artist: string
  coverImage: string
  audioUrl: string
  duration: number
}

interface AudioPlayerState {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  isLoading: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isMinimized: boolean
  showPlaylist: boolean

  // Actions
  setCurrentTrack: (track: Track) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (trackId: string) => void
  clearQueue: () => void
  playTrack: (track?: Track) => void
  pauseTrack: () => void
  togglePlay: () => void
  nextTrack: () => void
  previousTrack: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleMinimize: () => void
  togglePlaylist: () => void
}

export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  volume: 80,
  isMuted: false,
  isMinimized: false,
  showPlaylist: false,

  setCurrentTrack: (track) => set({ currentTrack: track, isLoading: true }),

  addToQueue: (track) =>
    set((state) => ({
      queue: [...state.queue, track],
    })),

  removeFromQueue: (trackId) =>
    set((state) => ({
      queue: state.queue.filter((track) => track.id !== trackId),
    })),

  clearQueue: () => set({ queue: [] }),

  playTrack: (track) => {
    if (track) {
      set({ currentTrack: track, isPlaying: true, isLoading: true })
    } else {
      set({ isPlaying: true })
    }
  },

  pauseTrack: () => set({ isPlaying: false }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  nextTrack: () => {
    const { currentTrack, queue } = get()
    if (!currentTrack || queue.length === 0) return

    const currentIndex = queue.findIndex((track) => track.id === currentTrack.id)
    if (currentIndex === -1 || currentIndex === queue.length - 1) return

    const nextTrack = queue[currentIndex + 1]
    set({ currentTrack: nextTrack, isLoading: true })
  },

  previousTrack: () => {
    const { currentTrack, queue } = get()
    if (!currentTrack || queue.length === 0) return

    const currentIndex = queue.findIndex((track) => track.id === currentTrack.id)
    if (currentIndex === -1 || currentIndex === 0) return

    const previousTrack = queue[currentIndex - 1]
    set({ currentTrack: previousTrack, isLoading: true })
  },

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration, isLoading: false }),

  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),

  togglePlaylist: () => set((state) => ({ showPlaylist: !state.showPlaylist })),
}))

