import { z } from "zod"
import { router } from "@/server/index"
import { adminProcedure } from "@/server/procedures/adminProcedure"
import { TRPCError } from "@trpc/server"

export const adminContentRouter = router({
  // Get all articles with pagination
  getArticles: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        search: z.string().optional(),
        categoryId: z.string().optional(),
        published: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, categoryId, published } = input

      const where = {
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(categoryId && { categoryId }),
        ...(published !== undefined && { published }),
      }

      const articles = await ctx.prisma.article.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
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

      let nextCursor: string | undefined = undefined
      if (articles.length > limit) {
        const nextItem = articles.pop()
        nextCursor = nextItem?.id
      }

      return {
        articles,
        nextCursor,
      }
    }),

  // Get article by ID
  getArticleById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const article = await ctx.prisma.article.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
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

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        })
      }

      return article
    }),

  // Create article
  createArticle: adminProcedure
    .input(
      z.object({
        title: z.string().min(3),
        slug: z
          .string()
          .min(3)
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        excerpt: z.string().optional(),
        content: z.string(),
        coverImage: z.string().optional(),
        published: z.boolean().default(false),
        publishedAt: z.date().optional(),
        categoryId: z.string().optional(),
        tagIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const current = await ctx.sessionService.current()
      const userId = current.user.id

      // Check if slug is already taken
      const existingArticle = await ctx.prisma.article.findUnique({
        where: { slug: input.slug },
      })

      if (existingArticle) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Slug is already taken",
        })
      }

      const article = await ctx.prisma.article.create({
        data: {
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          content: input.content,
          coverImage: input.coverImage,
          published: input.published,
          publishedAt: input.published ? input.publishedAt || new Date() : null,
          author: {
            connect: { id: userId },
          },
          ...(input.categoryId && {
            category: {
              connect: { id: input.categoryId },
            },
          }),
          ...(input.tagIds &&
            input.tagIds.length > 0 && {
            tags: {
              connect: input.tagIds.map((id) => ({ id })),
            },
          }),
        },
      })

      return article
    }),

  // Update article
  updateArticle: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(3).optional(),
        slug: z
          .string()
          .min(3)
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
          .optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        coverImage: z.string().optional(),
        published: z.boolean().optional(),
        publishedAt: z.date().optional(),
        categoryId: z.string().optional(),
        tagIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      // Check if article exists
      const existingArticle = await ctx.prisma.article.findUnique({
        where: { id },
      })

      if (!existingArticle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        })
      }

      // Check if slug is already taken by another article
      if (data.slug && data.slug !== existingArticle.slug) {
        const slugExists = await ctx.prisma.article.findUnique({
          where: { slug: data.slug },
        })

        if (slugExists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Slug is already taken",
          })
        }
      }

      // If publishing for the first time, set publishedAt
      let publishedAt = existingArticle.publishedAt
      if (data.published && !existingArticle.published) {
        publishedAt = data.publishedAt || new Date()
      }

      // Update article
      const article = await ctx.prisma.article.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          coverImage: data.coverImage,
          published: data.published,
          publishedAt,
          ...(data.categoryId && {
            category: {
              connect: { id: data.categoryId },
            },
          }),
          ...(data.tagIds && {
            tags: {
              set: data.tagIds.map((id) => ({ id })),
            },
          }),
        },
      })

      return article
    }),

  // Delete article
  deleteArticle: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if article exists
      const existingArticle = await ctx.prisma.article.findUnique({
        where: { id: input.id },
      })

      if (!existingArticle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        })
      }

      await ctx.prisma.article.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get all categories
  getCategories: adminProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      orderBy: { name: "asc" },
    })

    return categories
  }),

  // Get all tags
  getTags: adminProcedure.query(async ({ ctx }) => {
    const tags = await ctx.prisma.tag.findMany({
      orderBy: { name: "asc" },
    })

    return tags
  }),
})

