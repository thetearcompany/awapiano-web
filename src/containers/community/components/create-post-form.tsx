"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, Link2, Loader2, Music } from "lucide-react"
import { useUserStore } from "@/stores/user-store"

interface CreatePostFormProps {
  onSubmit: (content: string, mediaUrl?: string, mediaType?: "image" | "audio" | "link") => void
  isLoading: boolean
}

export function CreatePostForm({ onSubmit, isLoading }: CreatePostFormProps) {
  const [content, setContent] = useState("")
  const [mediaUrl, setMediaUrl] = useState<string | undefined>()
  const [mediaType, setMediaType] = useState<"image" | "audio" | "link" | undefined>()
  const [isMediaInputVisible, setIsMediaInputVisible] = useState(false)

  const { profile } = useUserStore()

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content, mediaUrl, mediaType)
      setContent("")
      setMediaUrl(undefined)
      setMediaType(undefined)
      setIsMediaInputVisible(false)
    }
  }

  const handleMediaTypeSelect = (type: "image" | "audio" | "link") => {
    setMediaType(type)
    setIsMediaInputVisible(true)
  }

  return (
    <Card className="glass-card p-6">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={profile?.image || "/placeholder.svg?height=40&width=40"} alt="User" />
          <AvatarFallback className="bg-primary">{profile?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="What's on your mind?"
            className="bg-white/5 border-white/10 focus:border-secondary mb-4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {isMediaInputVisible && (
            <div className="mb-4">
              <input
                type="text"
                placeholder={`Enter ${mediaType} URL...`}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:border-secondary"
                value={mediaUrl || ""}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`text-muted-foreground ${mediaType === "image" ? "bg-white/10" : ""}`}
                onClick={() => handleMediaTypeSelect("image")}
              >
                <ImageIcon className="h-4 w-4 mr-1" /> Photo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-muted-foreground ${mediaType === "audio" ? "bg-white/10" : ""}`}
                onClick={() => handleMediaTypeSelect("audio")}
              >
                <Music className="h-4 w-4 mr-1" /> Audio
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-muted-foreground ${mediaType === "link" ? "bg-white/10" : ""}`}
                onClick={() => handleMediaTypeSelect("link")}
              >
                <Link2 className="h-4 w-4 mr-1" /> Link
              </Button>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={handleSubmit}
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

