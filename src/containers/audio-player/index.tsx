"use client"

import { useEffect, useRef } from "react"
import { useAudioPlayerStore } from "@/stores/audio-player-store"
import { AudioPlayerView } from "./components/audio-player-view"
import { client } from "@/lib/api"

export function AudioPlayerContainer() {
  const {
    currentTrack,
    isPlaying,
    isMuted,
    volume,
    currentTime,
    isMinimized,
    showPlaylist,
    setCurrentTime,
    setDuration,
    togglePlay,
    toggleMute,
    setVolume,
    toggleMinimize,
    togglePlaylist,
    nextTrack,
    previousTrack,
  } = useAudioPlayerStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Create audio element if it doesn't exist
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()

      // Set up event listeners
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate)
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)
      audioRef.current.addEventListener("ended", handleEnded)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate)
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audioRef.current.removeEventListener("ended", handleEnded)
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audioUrl
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentTrack])

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  // Handle time seeking
  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  // Event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    nextTrack()
  }

  // Fetch now playing data from API
  const { data: nowPlaying } = client.audio.getNowPlaying.useQuery(undefined, {
    refetchInterval: 60000, // Refetch every minute
  })

  // Set current track if none is set and now playing data is available
  useEffect(() => {
    if (!currentTrack && nowPlaying) {
      // Transform the now playing data to match the Track interface
      const track = {
        id: nowPlaying.id,
        title: nowPlaying.title,
        artist: nowPlaying.artist,
        coverImage: nowPlaying.coverImage,
        audioUrl: "/path/to/audio.mp3", // This would come from the API in a real app
        duration: 180, // This would come from the API in a real app
      }

      useAudioPlayerStore.getState().setCurrentTrack(track)
    }
  }, [nowPlaying, currentTrack])

  return (
    <AudioPlayerView
      currentTrack={currentTrack}
      isPlaying={isPlaying}
      currentTime={currentTime}
      duration={audioRef.current?.duration || 0}
      volume={volume}
      isMuted={isMuted}
      isMinimized={isMinimized}
      showPlaylist={showPlaylist}
      onTogglePlay={togglePlay}
      onSeek={handleSeek}
      onVolumeChange={setVolume}
      onToggleMute={toggleMute}
      onToggleMinimize={toggleMinimize}
      onTogglePlaylist={togglePlaylist}
      onNext={nextTrack}
      onPrevious={previousTrack}
    />
  )
}

