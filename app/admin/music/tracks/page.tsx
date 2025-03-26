"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash,
  Play,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Music,
  Plus,
  Disc,
  Clock,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { client } from "@/lib/api"
import { useAdminStore } from "@/stores/admin-store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { formatDuration } from "@/lib/utils"

export default function TracksPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)

  // Admin store
  const setCurrentSection = useAdminStore((state) => state.setCurrentSection)

  // Local state for filters
  const [filters, setFilters] = useState({
    search: "",
    artistId: "",
    albumId: "",
    published: "",
    limit: 10,
    page: 1,
  })

  // Set current section for sidebar highlighting
  useEffect(() => {
    setCurrentSection("music")
  }, [setCurrentSection])

  // Fetch tracks
  const {
    data: tracksData,
    isLoading,
    refetch,
  } = client.admin.music.getTracks.useQuery({
    limit: filters.limit,
    search: filters.search || undefined,
    artistId: filters.artistId || undefined,
    albumId: filters.albumId || undefined,
    published: filters.published === "true" ? true : filters.published === "false" ? false : undefined,
    sortBy: "createdAt",
    sortDirection: "desc",
  })

  // Fetch track stats
  const { data: trackStats } = client.admin.music.getTrackStats.useQuery()

  // Delete track mutation
  const deleteTrackMutation = client.admin.music.deleteTrack.useMutation({
    onSuccess: () => {
      toast({
        title: "Track deleted",
        description: "The track has been successfully deleted.",
        variant: "default",
      })
      refetch()
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete track. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsDeleting(null)
    },
  })

  // Handle delete track
  const handleDeleteTrack = (id: string) => {
    setIsDeleting(id)
    deleteTrackMutation.mutate({ id })
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      ...filters,
      search: "",
      artistId: "",
      albumId: "",
      published: "",
    })
  }

  // Calculate pagination
  const totalPages = Math.ceil((tracksData?.tracks.length || 0) / filters.limit)

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    })
  }

  // Handle play track
  const handlePlayTrack = (id: string) => {
    if (isPlaying === id) {
      setIsPlaying(null)
    } else {
      setIsPlaying(id)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tracks"
        description="Manage music tracks and audio content"
        actions={
          <Link href="/admin/music/tracks/new">
            <Button className="gap-1">
              <Plus className="h-4 w-4" /> Upload Track
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tracks</p>
                <p className="text-2xl font-bold">{trackStats?.totalTracks || 0}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Music className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published Tracks</p>
                <p className="text-2xl font-bold">{trackStats?.publishedTracks || 0}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Disc className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Playbacks</p>
                <p className="text-2xl font-bold">{trackStats?.totalPlaybacks || 0}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Play className="h-4 w-4 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle>All Tracks</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tracks..."
                className="pl-9 bg-white/5 border-white/10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={filters.published} onValueChange={(value) => setFilters({ ...filters, published: value })}>
                <SelectTrigger className="bg-white/5 border-white/10 w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="true">Published</SelectItem>
                  <SelectItem value="false">Draft</SelectItem>
                </SelectContent>
              </Select>

              {(filters.search || filters.artistId || filters.albumId || filters.published) && (
                <Button type="button" variant="ghost" size="icon" onClick={handleClearFilters} className="h-10 w-10">
                  <X className="h-4 w-4" />
                </Button>
              )}

              <Button type="submit" variant="outline" className="gap-1">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>
          </form>

          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow>
                  <TableHead className="w-[300px]">
                    <div className="flex items-center gap-1">
                      Track
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Album</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Duration
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plays</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : tracksData?.tracks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No tracks found
                    </TableCell>
                  </TableRow>
                ) : (
                  tracksData?.tracks.map((track) => (
                    <TableRow key={track.id} className="hover:bg-white/5">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-md overflow-hidden bg-black/20">
                            {track.coverImage ? (
                              <img
                                src={track.coverImage || "/placeholder.svg"}
                                alt={track.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Music className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute inset-0 h-full w-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                              onClick={() => handlePlayTrack(track.id)}
                            >
                              <Play className="h-5 w-5" />
                            </Button>
                          </div>
                          <div className="truncate">
                            <p className="font-medium truncate">{track.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {track.bpm && `${track.bpm} BPM`} {track.key && `• ${track.key}`}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={track.artist.image || "/placeholder.svg?height=24&width=24"}
                              alt={track.artist.name || "Artist"}
                            />
                            <AvatarFallback className="text-xs">{track.artist.name?.charAt(0) || "A"}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{track.artist.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {track.album ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-md overflow-hidden bg-black/20">
                              {track.album.coverImage ? (
                                <img
                                  src={track.album.coverImage || "/placeholder.svg"}
                                  alt={track.album.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Disc className="h-3 w-3 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <span className="text-sm">{track.album.title}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No Album</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{formatDuration(track.duration)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={track.published ? "default" : "outline"}
                          className={
                            track.published
                              ? "bg-green-500/20 text-green-500 hover:bg-green-500/30 hover:text-green-500"
                              : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 hover:text-yellow-500"
                          }
                        >
                          {track.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                          {track._count.playbacks}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass border-white/10">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                              className="hover:bg-white/5"
                              onClick={() => router.push(`/admin/music/tracks/edit/${track.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-white/5" onClick={() => handlePlayTrack(track.id)}>
                              <Play className="h-4 w-4 mr-2" /> Play
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                              className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                              onClick={() => handleDeleteTrack(track.id)}
                              disabled={isDeleting === track.id}
                            >
                              {isDeleting === track.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Trash className="h-4 w-4 mr-2" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{tracksData?.tracks.length || 0}</span> results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={filters.page <= 1}
                onClick={() => handlePageChange(filters.page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className={`h-8 min-w-8 ${filters.page === i + 1 ? "bg-primary text-white" : ""}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={filters.page >= totalPages}
                onClick={() => handlePageChange(filters.page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

