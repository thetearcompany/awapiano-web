import { z } from "zod"
import { router, publicProcedure } from "../index"

export const contentRouter = router({
  getFeaturedArticle: publicProcedure.query(({ ctx: { contentService } }) => {
    return contentService.getFeaturedArticle()
  }),

  getLatestArticles: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
        categoryId: z.string().optional(),
      }),
    )
    .query(({ input, ctx: { contentService } }) => {
      return contentService.getLatestArticles(input.limit, input.cursor, input.categoryId)
    }),

  getArticleById: publicProcedure
    .input(
      z.object({
        articleId: z.string(),
      }),
    )
    .query(({ input, ctx: { contentService } }) => {
      return contentService.getArticleById(input.articleId)
    }),

  getCategories: publicProcedure.query(async ({ ctx: { contentService } }) => {
    return contentService.getCategories()
  }),

  getTags: publicProcedure.query(async ({ ctx: { contentService } }) => {
    return contentService.getTags()
  }),

  searchArticles: publicProcedure
    .input(
      z.object({
        query: z.string(),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(({ input, ctx: { contentService } }) => {
      return contentService.searchArticles(input.query, input.limit, input.cursor)
    }),
})

