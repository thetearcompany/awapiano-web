"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  ListMusic,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Download,
  Headphones,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Track } from "@/stores/audio-player-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"

interface AudioPlayerViewProps {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isMinimized: boolean
  showPlaylist: boolean
  onTogglePlayAction: () => void
  onSeekAction: (time: number) => void
  onVolumeChangeAction: (volume: number) => void
  onToggleMuteAction: () => void
  onToggleMinimizeAction: () => void
  onTogglePlaylistAction: () => void
  onNextAction: () => void
  onPreviousAction: () => void
}

export function AudioPlayerView({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isMinimized,
  showPlaylist,
  onTogglePlayAction,
  onSeekAction,
  onVolumeChangeAction,
  onToggleMuteAction,
  onToggleMinimizeAction,
  onTogglePlaylistAction,
  onNextAction,
  onPreviousAction,
}: AudioPlayerViewProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const isMobile = useIsMobile()

  // Audio visualization levels (for the waveform effect)
  const audioLevels = [0.3, 0.5, 0.7, 0.8, 1, 0.8, 0.7, 0.5, 0.3]

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const toggleVolumeControl = () => {
    setShowVolumeControl(!showVolumeControl)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // Close volume control when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowVolumeControl(false)
    }

    if (showVolumeControl) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [showVolumeControl])

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!currentTrack) {
    return null
  }

  // Expanded full-screen player for mobile
  if (isExpanded && isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <Button variant="ghost" size="icon" onClick={toggleExpanded}>
            <Minimize2 className="h-5 w-5" />
          </Button>
          <h2 className="font-bold">Now Playing</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-white/10">
              <DropdownMenuItem className="hover:bg-white/5">
                <Download className="h-4 w-4 mr-2" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/5">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="hover:bg-white/5">
                <ListMusic className="h-4 w-4 mr-2" /> View Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-lg overflow-hidden mb-8 sa-flag-border">
            <img
              src={currentTrack.coverImage || "/placeholder.svg?height=320&width=320"}
              alt={currentTrack.title}
              className="h-full w-full object-cover"
            />
          </div>

          <h3 className="text-xl font-bold mb-1">{currentTrack.title}</h3>
          <p className="text-muted-foreground mb-8">{currentTrack.artist}</p>

          <div className="w-full mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              className="w-full"
              onValueChange={(value) => onSeekAction(value[0])}
            />
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-12 w-12 hover:bg-white/5"
              onClick={onPreviousAction}
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-16 w-16 bg-secondary text-black hover:bg-secondary/90"
              onClick={onTogglePlayAction}
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-white/5" onClick={onNextAction}>
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full h-10 w-10", isLiked ? "text-accent" : "hover:bg-white/5")}
              onClick={toggleLike}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-accent")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 hover:bg-white/5"
              onClick={toggleVolumeControl}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 hover:bg-white/5"
              onClick={onTogglePlaylistAction}
            >
              <ListMusic className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-white/5">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {showVolumeControl && (
            <div className="mt-4 w-full max-w-xs">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                className="w-full"
                onValueChange={(value) => onVolumeChangeAction(value[0])}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "glass-card transition-all duration-300 sa-flag-border",
        isMinimized ? "p-2 sm:p-3" : "p-3 sm:p-4",
        "animate-fade-in",
      )}
    >
      {!isMinimized && (
        <div className="flex items-center gap-3 mb-3 sm:gap-4 sm:mb-4">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg overflow-hidden hover-scale">
            {currentTrack.coverImage && (
              <img
                src={currentTrack.coverImage || "/placeholder.svg"}
                alt={currentTrack.title}
                className="h-full w-full object-cover rounded-lg"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold truncate text-sm sm:text-base">{currentTrack.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10",
                isLiked ? "text-accent" : "text-white",
              )}
              onClick={toggleLike}
            >
              <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5 transition-all", isLiked && "fill-accent")} />
            </Button>
            {!isMobile && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-white/5 transition-colors h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-full transition-colors h-8 w-8 sm:h-10 sm:w-10",
                    showPlaylist ? "text-secondary" : "hover:bg-white/5",
                  )}
                  onClick={onTogglePlaylistAction}
                >
                  <ListMusic className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </>
            )}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/5 transition-colors h-8 w-8 sm:h-10 sm:w-10"
                onClick={toggleExpanded}
              >
                <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-4">
        {isMinimized ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/5 transition-colors h-8 w-8 touch-target"
              onClick={onTogglePlayAction}
            >
              {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            <div className="flex-1 min-w-0 relative">
              <p className="font-medium text-xs sm:text-sm truncate">{currentTrack.title}</p>
              <div
                className="absolute bottom-0 left-0 h-0.5 bg-secondary"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs hover:bg-white/5 transition-colors h-7 px-2"
              onClick={onToggleMinimizeAction}
            >
              <Headphones className="h-3 w-3 mr-1" />
              <span className="sr-only md:not-sr-only">Expand</span>
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/5 transition-colors h-8 w-8 sm:h-10 sm:w-10 touch-target"
                onClick={onPreviousAction}
              >
                <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-secondary text-black hover:bg-secondary/90 transition-colors hover-scale touch-target"
                onClick={onTogglePlayAction}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/5 transition-colors h-8 w-8 sm:h-10 sm:w-10 touch-target"
                onClick={onNextAction}
              >
                <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            <div className="flex-1 flex items-center gap-2 sm:gap-3">
              <span className="text-xs w-6 sm:w-8">{formatTime(currentTime)}</span>
              <div className="flex-1 flex items-center gap-1">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  className="flex-1"
                  onValueChange={(value) => onSeekAction(value[0])}
                />
                {!isMobile && (
                  <div className="flex h-6 items-center gap-[2px]">
                    {audioLevels.map((level, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-[3px] rounded-full transition-all duration-300",
                          isPlaying ? "animate-wave" : "opacity-50",
                          i % 2 === 0 ? "bg-primary" : "bg-secondary",
                        )}
                        style={{
                          height: `${level * 20}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs w-6 sm:w-8">{formatTime(duration)}</span>
            </div>

            {!isMobile && (
              <div className="flex items-center gap-2 min-w-[120px]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 hover:bg-white/5 transition-colors"
                  onClick={onToggleMuteAction}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  className="flex-1"
                  onValueChange={(value) => onVolumeChangeAction(value[0])}
                />
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-xs hover:bg-white/5 transition-colors h-7 px-2"
              onClick={onToggleMinimizeAction}
            >
              {isMobile ? "Min" : "Minimize"}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

