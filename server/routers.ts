import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ STORES ============
  stores: router({
    list: publicProcedure.query(async () => {
      return await db.getAllStores();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getStoreById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        logo: z.string().optional(),
        coverImage: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const storeId = await db.createStore({
          ...input,
          ownerId: ctx.user.id,
        });
        return { id: storeId };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        logo: z.string().optional(),
        coverImage: z.string().optional(),
        isActive: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateStore(id, updates);
        return { success: true };
      }),
  }),

  // ============ CATEGORIES ============
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        image: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const categoryId = await db.createCategory(input);
        return { id: categoryId };
      }),
  }),

  // ============ PRODUCTS ============
  products: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        storeId: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllProducts(input);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductById(input.id);
      }),
    
    getByStore: publicProcedure
      .input(z.object({ storeId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductsByStore(input.storeId);
      }),
    
    create: adminProcedure
      .input(z.object({
        storeId: z.number(),
        categoryId: z.number().optional(),
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().min(0),
        compareAtPrice: z.number().optional(),
        image: z.string().optional(),
        images: z.string().optional(),
        stock: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        const productId = await db.createProduct(input);
        return { id: productId };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        storeId: z.number().optional(),
        categoryId: z.number().optional(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().min(0).optional(),
        compareAtPrice: z.number().optional(),
        image: z.string().optional(),
        images: z.string().optional(),
        stock: z.number().optional(),
        isActive: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateProduct(id, updates);
        return { success: true };
      }),
  }),

  // ============ CART ============
  cart: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCartItems(ctx.user.id);
    }),
    
    add: protectedProcedure
      .input(z.object({
        productId: z.number(),
        quantity: z.number().default(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const itemId = await db.addToCart({
          userId: ctx.user.id,
          productId: input.productId,
          quantity: input.quantity,
        });
        return { id: itemId };
      }),
    
    updateQuantity: protectedProcedure
      .input(z.object({
        id: z.number(),
        quantity: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.updateCartItemQuantity(input.id, input.quantity);
        return { success: true };
      }),
    
    remove: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.removeFromCart(input.id);
        return { success: true };
      }),
    
    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearCart(ctx.user.id);
      return { success: true };
    }),
  }),

  // ============ ORDERS ============
  orders: router({
    create: protectedProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(),
          storeId: z.number(),
          quantity: z.number(),
          priceAtPurchase: z.number(),
          productName: z.string(),
        })),
        totalAmount: z.number(),
        shippingAddress: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const orderId = await db.createOrder(
          {
            userId: ctx.user.id,
            totalAmount: input.totalAmount,
            shippingAddress: input.shippingAddress,
            notes: input.notes,
          },
          input.items
        );
        
        // Clear cart after successful order
        await db.clearCart(ctx.user.id);
        
        return { id: orderId };
      }),
    
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserOrders(ctx.user.id);
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await db.getOrderById(input.id);
        if (!order) return null;
        
        // Only allow users to see their own orders (unless admin)
        if (order.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new Error('Forbidden');
        }
        
        const items = await db.getOrderItems(input.id);
        return { ...order, items };
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      }))
      .mutation(async ({ input }) => {
        await db.updateOrderStatus(input.id, input.status);
        return { success: true };
      }),
    
    listAll: adminProcedure.query(async () => {
      return await db.getAllOrders();
    }),
  }),
});

export type AppRouter = typeof appRouter;
