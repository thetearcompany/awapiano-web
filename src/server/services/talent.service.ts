export class TalentService {
  async getSpotlightArtist() {
    // In a real application, we would fetch from a database
    // For now, we'll return mock data
    return {
      id: "artist-1",
      name: "DJ Soulful",
      location: "Johannesburg, South Africa",
      image: "/placeholder.svg?height=600&width=600",
      bio: "Rising star DJ Soulful brings a fresh perspective to the Amapiano scene, blending traditional piano melodies with innovative electronic elements. His unique sound has been gaining attention across South Africa.",
      rating: 5.0,
      ratingCount: 124,
      featuredTrack: {
        id: "track-1",
        title: "Sunset in Soweto",
        duration: "4:32",
        releaseDate: "June 2023",
      },
    }
  }

  async getSubmissions(params: {
    type: "all" | "mixes" | "originals" | "remixes"
    limit: number
    cursor?: string
    sortBy: "recent" | "popular" | "rating"
  }) {
    // Mock data for submissions
    const submissions = [
      {
        id: "submission-1",
        title: "Summer Vibes Mix",
        type: "mix",
        artist: {
          id: "user-1",
          name: "DJ Rhythm",
          image: "/placeholder.svg?height=24&width=24",
        },
        duration: "5:42",
        date: "2 days ago",
        image: "/placeholder.svg?height=128&width=128",
        likes: 124,
        comments: 18,
        downloads: 56,
        rating: 4.8,
      },
      {
        id: "submission-2",
        title: "Amapiano Fusion",
        type: "original",
        artist: {
          id: "user-2",
          name: "Producer X",
          image: "/placeholder.svg?height=24&width=24",
        },
        duration: "3:15",
        date: "5 days ago",
        image: "/placeholder.svg?height=128&width=128",
        likes: 87,
        comments: 12,
        downloads: 34,
        rating: 4.5,
      },
      // More submissions...
    ]

    // Filter by type
    let filteredSubmissions = submissions
    if (params.type !== "all") {
      filteredSubmissions = submissions.filter((s) => s.type === params.type)
    }

    // Apply sorting
    switch (params.sortBy) {
      case "recent":
        // In a real app, we would sort by date
        break
      case "popular":
        filteredSubmissions.sort((a, b) => b.likes - a.likes)
        break
      case "rating":
        filteredSubmissions.sort((a, b) => b.rating - a.rating)
        break
    }

    // Simulate pagination
    const startIndex = params.cursor ? Number.parseInt(params.cursor) : 0
    const endIndex = startIndex + params.limit
    const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex)

    const nextCursor = endIndex < filteredSubmissions.length ? endIndex.toString() : null

    return {
      submissions: paginatedSubmissions,
      nextCursor,
    }
  }

  async getTopRated(period: "week" | "month" | "allTime", limit: number) {
    // Mock data for top rated submissions
    const topRated = [
      {
        id: "top-1",
        title: "Amapiano Sunrise",
        artist: "Producer Name",
        rating: 5.0,
        ratingCount: 87,
        image: "/placeholder.svg?height=400&width=400",
        audioUrl: "/path/to/audio.mp3",
      },
      {
        id: "top-2",
        title: "Piano Dreams",
        artist: "Beat Maker",
        rating: 4.9,
        ratingCount: 65,
        image: "/placeholder.svg?height=400&width=400",
        audioUrl: "/path/to/audio.mp3",
      },
      {
        id: "top-3",
        title: "Rhythm of Soweto",
        artist: "DJ Flow",
        rating: 4.8,
        ratingCount: 92,
        image: "/placeholder.svg?height=400&width=400",
        audioUrl: "/path/to/audio.mp3",
      },
      // More top rated...
    ]

    // In a real app, we would filter by period

    return topRated.slice(0, limit)
  }

  async getSubmissionById(submissionId: string) {
    // In a real application, we would fetch from a database
    // For now, we'll return mock data
    return {
      id: submissionId,
      title: "First Light (Demo)",
      artist: {
        id: "user-3",
        name: "New Producer",
        image: "/placeholder.svg?height=24&width=24",
      },
      type: "original",
      duration: "3:24",
      date: "1 day ago",
      image: "/placeholder.svg?height=400&width=400",
      audioUrl: "/path/to/audio.mp3",
      description: "My first attempt at an Amapiano track. Looking for feedback on the arrangement and mix.",
      likes: 45,
      comments: 8,
      downloads: 12,
      feedback: [
        {
          id: "feedback-1",
          user: {
            id: "reviewer-1",
            name: "Pro Reviewer",
            image: "/placeholder.svg?height=32&width=32",
            isVerified: true,
          },
          rating: 4,
          comment:
            "Great start! The log drum pattern is solid, but I think the mix could use some work. The bass is a bit overpowering and the vocals could be more prominent. Try adjusting the EQ and compression.",
          date: "12 hours ago",
          helpfulCount: 24,
        },
        // More feedback...
      ],
      ratingBreakdown: {
        originality: 85,
        productionQuality: 70,
        arrangement: 80,
        danceability: 90,
      },
    }
  }

  async submitFeedback(
    userId: string,
    data: {
      submissionId: string
      rating: number
      comment: string
      ratings?: {
        originality?: number
        productionQuality?: number
        arrangement?: number
        danceability?: number
      }
    },
  ) {
    // In a real application, we would update a database
    // For now, we'll return a success response
    return {
      success: true,
      feedbackId: "new-feedback-id",
    }
  }

  async createSubmission(
    userId: string,
    data: {
      title: string
      description: string
      type: "mix" | "original" | "remix"
      audioUrl: string
      coverImageUrl?: string
      tags?: string[]
      duration: number
    },
  ) {
    // In a real application, we would update a database
    // For now, we'll return a success response with mock data
    return {
      success: true,
      submission: {
        id: "new-submission-id",
        title: data.title,
        type: data.type,
        description: data.description,
        audioUrl: data.audioUrl,
        coverImageUrl: data.coverImageUrl || "/placeholder.svg?height=400&width=400",
        duration: data.duration,
        createdAt: new Date().toISOString(),
      },
    }
  }
}

