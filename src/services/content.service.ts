export class ContentService {
  async getFeaturedArticle() {
    // In a real application, we would fetch from a database
    // For now, we'll return mock data
    return {
      id: "article-1",
      title: "The Rise of Amapiano: How South Africa's Sound Conquered the World",
      category: "Interview",
      date: "June 15, 2023",
      readTime: "10 min",
      image: "/placeholder.svg?height=600&width=600",
      excerpt:
        "We sit down with the pioneers of the Amapiano movement to discuss how this uniquely South African sound has captured global attention and what's next for the genre.",
      author: {
        id: "author-1",
        name: "Sarah Adams",
        role: "Music Journalist",
        image: "/placeholder.svg?height=40&width=40",
      },
    }
  }

  async getLatestArticles(limit: number, cursor?: string, categoryId?: string) {
    // Mock data for articles
    const articles = [
      {
        id: "article-2",
        title: "Top 10 Amapiano Tracks of 2023 So Far",
        category: "Feature",
        date: "June 10, 2023",
        readTime: "5 min",
        image: "/placeholder.svg?height=300&width=400",
        excerpt:
          "We count down the most impactful Amapiano releases that have defined the sound in 2023, from chart-toppers to underground gems.",
        isNew: true,
      },
      // More articles...
    ]

    // Filter by category if provided
    const filteredArticles = categoryId
      ? articles.filter((article) => article.category.toLowerCase() === categoryId.toLowerCase())
      : articles

    // Simulate pagination
    const startIndex = cursor ? Number.parseInt(cursor) : 0
    const endIndex = startIndex + limit
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

    const nextCursor = endIndex < filteredArticles.length ? endIndex.toString() : null

    return {
      articles: paginatedArticles,
      nextCursor,
    }
  }

  async getArticleById(articleId: string) {
    // In a real application, we would fetch from a database
    // For now, we'll return mock data
    return {
      id: articleId,
      title: "The Rise of Amapiano: How South Africa's Sound Conquered the World",
      category: "Interview",
      date: "June 15, 2023",
      readTime: "10 min",
      image: "/placeholder.svg?height=600&width=600",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
      author: {
        id: "author-1",
        name: "Sarah Adams",
        role: "Music Journalist",
        image: "/placeholder.svg?height=40&width=40",
      },
      tags: ["Amapiano", "South Africa", "DJ Maphorisa", "Kabza De Small"],
      relatedArticles: [
        {
          id: "article-2",
          title: "Top 10 Amapiano Tracks of 2023 So Far",
          image: "/placeholder.svg?height=100&width=100",
        },
      ],
    }
  }

  async getCategories() {
    return [
      { id: "interviews", name: "Interviews" },
      { id: "features", name: "Features" },
      { id: "news", name: "News" },
      { id: "reviews", name: "Reviews" },
      { id: "tutorials", name: "Tutorials" },
      { id: "events", name: "Events" },
      { id: "culture", name: "Culture" },
      { id: "industry", name: "Industry" },
    ]
  }

  async getTags() {
    return [
      "Amapiano",
      "South Africa",
      "DJ Maphorisa",
      "Kabza De Small",
      "Log Drum",
      "Piano",
      "Johannesburg",
      "Dance",
      "Culture",
      "Music Production",
      "Samples",
      "Tutorial",
      "Festival",
      "Vinyl",
      "Streaming",
      "Charts",
    ]
  }

  async searchArticles(query: string, limit: number, cursor?: string) {
    // In a real application, we would search in a database
    // For now, we'll return mock data
    const articles = [
      {
        id: "article-1",
        title: "The Rise of Amapiano: How South Africa's Sound Conquered the World",
        category: "Interview",
        date: "June 15, 2023",
        readTime: "10 min",
        image: "/placeholder.svg?height=100&width=100",
        excerpt:
          "We sit down with the pioneers of the Amapiano movement to discuss how this uniquely South African sound has captured global attention and what's next for the genre.",
      },
      // More articles...
    ]

    // Simulate pagination
    const startIndex = cursor ? Number.parseInt(cursor) : 0
    const endIndex = startIndex + limit
    const paginatedArticles = articles.slice(startIndex, endIndex)

    const nextCursor = endIndex < articles.length ? endIndex.toString() : null

    return {
      articles: paginatedArticles,
      nextCursor,
    }
  }
}

