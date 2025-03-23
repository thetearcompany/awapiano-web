"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Share2, ListMusic } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  className?: string
  isMinimized?: boolean
  onToggleMinimize?: () => void
  showPlaylist?: boolean
  onTogglePlaylist?: () => void
}

export function AudioPlayer({
  className,
  isMinimized = false,
  onToggleMinimize,
  showPlaylist = false,
  onTogglePlaylist,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Audio visualization
  const [audioLevels, setAudioLevels] = useState([0.3, 0.5, 0.7, 0.8, 1, 0.8, 0.7, 0.5, 0.3])

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        // Simulate audio visualization by randomizing levels
        setAudioLevels(audioLevels.map(() => Math.random() * 0.7 + 0.3))

        // Simulate time progress
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isPlaying, audioLevels, duration])

  useEffect(() => {
    // Set a dummy duration
    setDuration(180) // 3 minutes
  }, [])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className={cn("glass-card transition-all duration-300", isMinimized ? "p-3" : "p-4", className)}>
      {!isMinimized && (
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold truncate">Amapiano Summer Mix 2023</h3>
            <p className="text-sm text-muted-foreground truncate">DJ Maphorisa & Kabza De Small</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full", isLiked ? "text-accent" : "text-white")}
              onClick={toggleLike}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-accent")} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
            {onTogglePlaylist && (
              <Button
                variant="ghost"
                size="icon"
                className={cn("rounded-full", showPlaylist && "text-secondary")}
                onClick={onTogglePlaylist}
              >
                <ListMusic className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {isMinimized ? (
          <>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">Amapiano Summer Mix 2023</p>
            </div>
            {onToggleMinimize && (
              <Button variant="ghost" size="sm" className="text-xs" onClick={onToggleMinimize}>
                Expand
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-12 w-12 bg-secondary text-black hover:bg-secondary/90"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 flex items-center gap-3">
              <span className="text-xs w-8">{formatTime(currentTime)}</span>
              <div className="flex-1 flex items-center gap-1">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  className="flex-1"
                  onValueChange={(value) => setCurrentTime(value[0])}
                />
                <div className="flex h-6 items-center gap-[2px]">
                  {audioLevels.map((level, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-[3px] bg-secondary rounded-full transition-all duration-300",
                        isPlaying ? "animate-wave" : "opacity-50",
                      )}
                      style={{
                        height: `${level * 20}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              <span className="text-xs w-8">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center gap-2 min-w-[120px]">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                className="flex-1"
                onValueChange={(value) => {
                  setVolume(value[0])
                  setIsMuted(value[0] === 0)
                }}
              />
            </div>

            {onToggleMinimize && (
              <Button variant="ghost" size="sm" className="text-xs" onClick={onToggleMinimize}>
                Minimize
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

