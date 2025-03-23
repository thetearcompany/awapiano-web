import { z } from "zod"
import { router } from "@/server/index"
import { adminProcedure } from "@/server/procedures/adminProcedure"
import { TRPCError } from "@trpc/server"
import { OrderStatus } from "@prisma/client"

export const adminShopRouter = router({
  // Get all products with pagination
  getProducts: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        search: z.string().optional(),
        type: z.string().optional(),
        published: z.boolean().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sortBy: z.enum(["title", "price", "createdAt", "inventory"]).optional(),
        sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, type, published, minPrice, maxPrice, sortBy, sortDirection } = input

      const where = {
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(type && { type }),
        ...(published !== undefined && { published }),
        ...(minPrice !== undefined && { price: { gte: minPrice } }),
        ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      }

      const orderBy = sortBy ? { [sortBy]: sortDirection } : { createdAt: sortDirection }

      const products = await ctx.prisma.product.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy,
        include: {
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              orderItems: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (products.length > limit) {
        const nextItem = products.pop()
        nextCursor = nextItem?.id
      }

      return {
        products,
        nextCursor,
      }
    }),

  // Get product by ID
  getProductById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.id },
        include: {
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
          tracks: {
            select: {
              id: true,
              title: true,
              artist: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          orderItems: {
            take: 5,
            include: {
              order: {
                select: {
                  id: true,
                  status: true,
                  createdAt: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      })

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        })
      }

      return product
    }),

  // Create product
  createProduct: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        price: z.number().min(0),
        salePrice: z.number().min(0).optional(),
        inventory: z.number().min(0).default(0),
        imageUrl: z.string().optional(),
        type: z.string(),
        published: z.boolean().default(false),
        tagIds: z.array(z.string()).optional(),
        trackIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { tagIds, trackIds, ...data } = input

      // Create product
      const product = await ctx.prisma.product.create({
        data: {
          ...data,
          ...(tagIds &&
            tagIds.length > 0 && {
            tags: {
              connect: tagIds.map((id) => ({ id })),
            },
          }),
          ...(trackIds &&
            trackIds.length > 0 && {
            tracks: {
              connect: trackIds.map((id) => ({ id })),
            },
          }),
        },
      })

      return product
    }),

  // Update product
  updateProduct: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().min(0).optional(),
        salePrice: z.number().min(0).optional(),
        inventory: z.number().min(0).optional(),
        imageUrl: z.string().optional(),
        type: z.string().optional(),
        published: z.boolean().optional(),
        tagIds: z.array(z.string()).optional(),
        trackIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tagIds, trackIds, ...data } = input

      // Check if product exists
      const existingProduct = await ctx.prisma.product.findUnique({
        where: { id },
      })

      if (!existingProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        })
      }

      // Update product
      const product = await ctx.prisma.product.update({
        where: { id },
        data: {
          ...data,
          ...(tagIds && {
            tags: {
              set: tagIds.map((id) => ({ id })),
            },
          }),
          ...(trackIds && {
            tracks: {
              set: trackIds.map((id) => ({ id })),
            },
          }),
        },
      })

      return product
    }),

  // Delete product
  deleteProduct: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if product exists
      const existingProduct = await ctx.prisma.product.findUnique({
        where: { id: input.id },
      })

      if (!existingProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        })
      }

      // Check if product has order items
      const orderItemsCount = await ctx.prisma.orderItem.count({
        where: { productId: input.id },
      })

      if (orderItemsCount > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete product with order items. Archive it instead.",
        })
      }

      // Delete product
      await ctx.prisma.product.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get all orders with pagination
  getOrders: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        search: z.string().optional(),
        status: z.nativeEnum(OrderStatus).optional(),
        userId: z.string().optional(),
        sortBy: z.enum(["createdAt", "total"]).optional(),
        sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, status, userId, sortBy, sortDirection } = input

      const where = {
        ...(search && {
          OR: [
            { id: { contains: search } },
            { user: { name: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
          ],
        }),
        ...(status && { status }),
        ...(userId && { userId }),
      }

      const orderBy = sortBy ? { [sortBy]: sortDirection } : { createdAt: sortDirection }

      const orders = await ctx.prisma.order.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (orders.length > limit) {
        const nextItem = orders.pop()
        nextCursor = nextItem?.id
      }

      return {
        orders,
        nextCursor,
      }
    }),

  // Get order by ID
  getOrderById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        })
      }

      return order
    }),

  // Update order status
  updateOrderStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(OrderStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input

      // Check if order exists
      const existingOrder = await ctx.prisma.order.findUnique({
        where: { id },
      })

      if (!existingOrder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        })
      }

      // Update order status
      const order = await ctx.prisma.order.update({
        where: { id },
        data: { status },
      })

      return order
    }),

  // Get shop stats
  getShopStats: adminProcedure.query(async ({ ctx }) => {
    // Get total products
    const totalProducts = await ctx.prisma.product.count()

    // Get published products
    const publishedProducts = await ctx.prisma.product.count({
      where: { published: true },
    })

    // Get total orders
    const totalOrders = await ctx.prisma.order.count()

    // Get total revenue
    const revenue = await ctx.prisma.order.aggregate({
      where: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.FULFILLED],
        },
      },
      _sum: {
        total: true,
      },
    })

    // Get orders by status
    const ordersByStatus = await ctx.prisma.order.groupBy({
      by: ["status"],
      _count: true,
    })

    // Get top selling products
    const topSellingProducts = await ctx.prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    })

    const productIds = topSellingProducts.map((item) => item.productId)
    const products = await ctx.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    })

    // Get recent orders
    const recentOrders = await ctx.prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return {
      totalProducts,
      publishedProducts,
      totalOrders,
      revenue: revenue._sum.total || 0,
      ordersByStatus: Object.values(OrderStatus).map((status) => ({
        status,
        count: ordersByStatus.find((o) => o.status === status)?._count || 0,
      })),
      topSellingProducts: topSellingProducts.map((item) => ({
        productId: item.productId,
        quantity: item._sum.quantity || 0,
        product: products.find((p) => p.id === item.productId),
      })),
      recentOrders,
    }
  }),
})

