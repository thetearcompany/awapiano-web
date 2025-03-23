import { prisma } from "@/lib/prisma"

export class UserService {
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    return {
      ...user,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      postsCount: user._count.posts,
    }
  }

  async updateUserProfile(
    userId: string,
    data: {
      name?: string
      bio?: string
      location?: string
      website?: string
      avatarUrl?: string
    },
  ) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        bio: data.bio,
        location: data.location,
        website: data.website,
        image: data.avatarUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        website: true,
      },
    })

    return updatedUser
  }

  async getUserFollowers(userId: string, limit: number, cursor?: string) {
    const followers = await prisma.follows.findMany({
      where: {
        followingId: userId,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const nextCursor = followers.length === limit ? followers[followers.length - 1].id : null

    return {
      followers: followers.map((follow) => follow.follower),
      nextCursor,
    }
  }

  async getUserFollowing(userId: string, limit: number, cursor?: string) {
    const following = await prisma.follows.findMany({
      where: {
        followerId: userId,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        following: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const nextCursor = following.length === limit ? following[following.length - 1].id : null

    return {
      following: following.map((follow) => follow.following),
      nextCursor,
    }
  }

  async followUser(followerId: string, followingId: string) {
    // Check if already following
    const existingFollow = await prisma.follows.findFirst({
      where: {
        followerId,
        followingId,
      },
    })

    if (existingFollow) {
      return { success: true, alreadyFollowing: true }
    }

    await prisma.follows.create({
      data: {
        followerId,
        followingId,
      },
    })

    return { success: true, alreadyFollowing: false }
  }

  async unfollowUser(followerId: string, followingId: string) {
    await prisma.follows.deleteMany({
      where: {
        followerId,
        followingId,
      },
    })

    return { success: true }
  }
}

