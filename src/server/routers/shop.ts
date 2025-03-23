import { z } from "zod"
import { router, publicProcedure } from "../index"
import { ShopService } from "@/services/shop.service"

const shopService = new ShopService()

export const shopRouter = router({
  getProducts: publicProcedure
    .input(
      z.object({
        category: z.enum(["beats", "samples", "merch", "vinyl"]).optional(),
        limit: z.number().min(1).max(50).default(12),
        cursor: z.string().optional(),
        sortBy: z.enum(["newest", "popular", "price-low", "price-high"]).optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        artistIds: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        bpmMin: z.number().optional(),
        bpmMax: z.number().optional(),
        key: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      return shopService.getProducts(input)
    }),

  getProductById: publicProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(({ input }) => {
      return shopService.getProductById(input.productId)
    }),

  getFeaturedProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).default(3),
      }),
    )
    .query(({ input }) => {
      return shopService.getFeaturedProducts(input.limit)
    }),

  getProductReviews: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      return shopService.getProductReviews(input.productId, input.limit, input.cursor)
    }),

  addToCart: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1).default(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not authenticated")
      }
      return shopService.addToCart(userId, input.productId, input.quantity)
    }),

  removeFromCart: publicProcedure
    .input(
      z.object({
        cartItemId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not authenticated")
      }
      return shopService.removeFromCart(userId, input.cartItemId)
    }),

  getCart: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id
    if (!userId) {
      throw new Error("User not authenticated")
    }
    return shopService.getCart(userId)
  }),
})

