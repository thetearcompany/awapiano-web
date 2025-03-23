"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookmarkPlus, Heart, MessageCircle, MoreHorizontal, Send, Share2, ThumbsUp } from "lucide-react"
import type { Post } from "@/stores/community-store"
import Image from "next/image"
import { useMobileDetect } from "@/hooks/use-mobile"

interface PostItemProps {
  post: Post
  onLike: () => void
  onUnlike: () => void
  onComment: (content: string) => void
}

export function PostItem({ post, onLike, onUnlike, onComment }: PostItemProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const commentInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useMobileDetect()

  const handleLikeToggle = () => {
    if (isLiked) {
      onUnlike()
      setIsLiked(false)
    } else {
      onLike()
      setIsLiked(true)
    }
  }

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setIsSubmitting(true)
      onComment(commentText)
      setTimeout(() => {
        setCommentText("")
        setIsSubmitting(false)
      }, 500)
    }
  }

  const handleCommentClick = () => {
    setShowComments(!showComments)
    // Focus the input when comments are shown
    if (!showComments) {
      setTimeout(() => {
        commentInputRef.current?.focus()
      }, 100)
    }
  }

  return (
    <Card className="glass-card p-4 md:p-6 animate-fade-in">
      <div className="flex gap-3 md:gap-4">
        <Avatar className="h-9 w-9 md:h-10 md:w-10 border">
          <AvatarImage src={post.user.image} alt={post.user.name} />
          <AvatarFallback className="bg-primary">{post.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="font-bold text-sm md:text-base">{post.user.name}</span>
              <span className="text-muted-foreground text-xs md:text-sm"> @{post.user.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{post.createdAt}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8 rounded-full hover:bg-white/5">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-white/10 animate-fade-in">
                  <DropdownMenuItem className="hover:bg-white/5 text-sm">
                    <BookmarkPlus className="h-4 w-4 mr-2" /> Save Post
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/5 text-sm">
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="hover:bg-white/5 text-accent text-sm">Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="mb-4 text-sm md:text-base">{post.content}</p>

          {post.mediaUrl && post.mediaType === "image" && (
            <div className="mb-4 rounded-xl overflow-hidden">
              <Image
                src={post.mediaUrl || "/placeholder.svg"}
                alt="Post image"
                width={600}
                height={400}
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2 hover:bg-white/5" onClick={handleLikeToggle}>
              <Heart className={`h-4 w-4 ${isLiked ? "fill-accent text-accent" : ""}`} />
              <span className="text-xs md:text-sm">{post.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2 hover:bg-white/5" onClick={handleCommentClick}>
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs md:text-sm">{post.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2 hover:bg-white/5">
              <Share2 className="h-4 w-4" />
              <span className="text-xs md:text-sm">{post.shares}</span>
            </Button>
          </div>

          {/* Comments */}
          {(showComments || post.commentsList) && (
            <div className="space-y-4 border-t border-white/10 pt-4 animate-slide-in">
              {post.commentsList &&
                post.commentsList.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-7 w-7 md:h-8 md:w-8 border">
                      <AvatarImage src={comment.user.image} alt={comment.user.name} />
                      <AvatarFallback className="bg-primary text-xs">{comment.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-medium text-xs md:text-sm">{comment.user.name}</span>
                        <span className="text-muted-foreground text-xs">@{comment.user.username}</span>
                      </div>
                      <p className="text-xs md:text-sm mb-1">{comment.content}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Button variant="ghost" size="sm" className="h-6 px-2 gap-1 hover:bg-white/5">
                          <ThumbsUp className="h-3 w-3" /> {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 hover:bg-white/5">
                          Reply
                        </Button>
                        <span>{comment.createdAt}</span>
                      </div>
                    </div>
                  </div>
                ))}

              <div className="flex gap-3">
                <Avatar className="h-7 w-7 md:h-8 md:w-8 border">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback className="bg-primary text-xs">U</AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                  <Input
                    ref={commentInputRef}
                    placeholder="Write a comment..."
                    className="bg-white/5 border-white/10 focus:border-secondary pr-10 text-sm h-9"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleCommentSubmit()
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 bottom-1 h-7 w-7 rounded-full hover:bg-white/5"
                    onClick={handleCommentSubmit}
                    disabled={isSubmitting || !commentText.trim()}
                  >
                    <Send className={`h-4 w-4 ${isSubmitting ? "animate-pulse" : ""}`} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

