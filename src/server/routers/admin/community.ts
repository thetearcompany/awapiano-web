import { z } from "zod"
import { router } from "@/server/index"
import { adminProcedure } from "@/server/procedures/adminProcedure"
import { TRPCError } from "@trpc/server"

export const adminCommunityRouter = router({
  // Get all posts with pagination
  getPosts: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        search: z.string().optional(),
        userId: z.string().optional(),
        published: z.boolean().optional(),
        sortBy: z.enum(["createdAt", "likes"]).optional(),
        sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, userId, published, sortBy, sortDirection } = input

      const where = {
        ...(search && {
          content: { contains: search, mode: "insensitive" },
        }),
        ...(userId && { userId }),
        ...(published !== undefined && { published }),
      }

      const orderBy = sortBy ? { [sortBy]: sortDirection } : { createdAt: sortDirection }

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (posts.length > limit) {
        const nextItem = posts.pop()
        nextCursor = nextItem?.id
      }

      return {
        posts,
        nextCursor,
      }
    }),

  // Get post by ID
  getPostById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              replies: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
            where: {
              parentId: null,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            take: 10,
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        })
      }

      return post
    }),

  // Update post
  updatePost: adminProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().optional(),
        mediaUrl: z.string().optional(),
        mediaType: z.string().optional(),
        published: z.boolean().optional(),
        tagIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tagIds, ...data } = input

      // Check if post exists
      const existingPost = await ctx.prisma.post.findUnique({
        where: { id },
      })

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        })
      }

      // Update post
      const post = await ctx.prisma.post.update({
        where: { id },
        data: {
          ...data,
          ...(tagIds && {
            tags: {
              set: tagIds.map((id) => ({ id })),
            },
          }),
        },
      })

      return post
    }),

  // Delete post
  deletePost: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if post exists
      const existingPost = await ctx.prisma.post.findUnique({
        where: { id: input.id },
      })

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        })
      }

      // Delete post
      await ctx.prisma.post.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get all comments with pagination
  getComments: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        search: z.string().optional(),
        postId: z.string().optional(),
        userId: z.string().optional(),
        sortBy: z.enum(["createdAt"]).optional(),
        sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, postId, userId, sortBy, sortDirection } = input

      const where = {
        ...(search && {
          content: { contains: search, mode: "insensitive" },
        }),
        ...(postId && { postId }),
        ...(userId && { userId }),
      }

      const orderBy = sortBy ? { [sortBy]: sortDirection } : { createdAt: sortDirection }

      const comments = await ctx.prisma.comment.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          post: {
            select: {
              id: true,
              content: true,
            },
          },
          parent: {
            select: {
              id: true,
              content: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (comments.length > limit) {
        const nextItem = comments.pop()
        nextCursor = nextItem?.id
      }

      return {
        comments,
        nextCursor,
      }
    }),

  // Delete comment
  deleteComment: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if comment exists
      const existingComment = await ctx.prisma.comment.findUnique({
        where: { id: input.id },
      })

      if (!existingComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        })
      }

      // Delete comment
      await ctx.prisma.comment.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get all groups with pagination
  getGroups: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.enum(["name", "createdAt"]).optional(),
        sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, sortBy, sortDirection } = input

      const where = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      }

      const orderBy = sortBy ? { [sortBy]: sortDirection } : { createdAt: sortDirection }

      const groups = await ctx.prisma.group.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy,
        include: {
          _count: {
            select: {
              members: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (groups.length > limit) {
        const nextItem = groups.pop()
        nextCursor = nextItem?.id
      }

      return {
        groups,
        nextCursor,
      }
    }),

  // Get group by ID
  getGroupById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findUnique({
        where: { id: input.id },
        include: {
          members: {
            include: {
              group: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group not found",
        })
      }

      return group
    }),

  // Create group
  createGroup: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        tagIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { tagIds, ...data } = input

      // Create group
      const group = await ctx.prisma.group.create({
        data: {
          ...data,
          ...(tagIds &&
            tagIds.length > 0 && {
            tags: {
              connect: tagIds.map((id) => ({ id })),
            },
          }),
        },
      })

      return group
    }),

  // Update group
  updateGroup: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        tagIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tagIds, ...data } = input

      // Check if group exists
      const existingGroup = await ctx.prisma.group.findUnique({
        where: { id },
      })

      if (!existingGroup) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group not found",
        })
      }

      // Update group
      const group = await ctx.prisma.group.update({
        where: { id },
        data: {
          ...data,
          ...(tagIds && {
            tags: {
              set: tagIds.map((id) => ({ id })),
            },
          }),
        },
      })

      return group
    }),

  // Delete group
  deleteGroup: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if group exists
      const existingGroup = await ctx.prisma.group.findUnique({
        where: { id: input.id },
      })

      if (!existingGroup) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group not found",
        })
      }

      // Delete group
      await ctx.prisma.group.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get community stats
  getCommunityStats: adminProcedure.query(async ({ ctx }) => {
    // Get total posts
    const totalPosts = await ctx.prisma.post.count()

    // Get total comments
    const totalComments = await ctx.prisma.comment.count()

    // Get total groups
    const totalGroups = await ctx.prisma.group.count()

    // Get total likes
    const totalLikes = await ctx.prisma.like.count()

    // Get most active users
    const mostActiveUsers = await ctx.prisma.post.groupBy({
      by: ["userId"],
      _count: true,
      orderBy: {
        _count: {
          userId: "desc"
        },
      },
      take: 5,
    })

    const userIds = mostActiveUsers.map((item) => item.userId)
    const users = await ctx.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    })

    // Get most popular posts
    const popularPosts = await ctx.prisma.like.groupBy({
      by: ["postId"],
      _count: true,
      orderBy: {
        _count: {
          postId: "desc"
        },
      },
      take: 5,
    })

    const postIds = popularPosts.map((item) => item.postId)
    const posts = await ctx.prisma.post.findMany({
      where: {
        id: {
          in: postIds,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return {
      totalPosts,
      totalComments,
      totalGroups,
      totalLikes,
      mostActiveUsers: mostActiveUsers.map((item) => ({
        userId: item.userId,
        count: item._count,
        user: users.find((u) => u.id === item.userId),
      })),
      popularPosts: popularPosts.map((item) => ({
        postId: item.postId,
        count: item._count,
        post: posts.find((p) => p.id === item.postId),
      })),
    }
  }),
})

