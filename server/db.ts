import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  stores, InsertStore,
  categories, InsertCategory,
  products, InsertProduct,
  cartItems, InsertCartItem,
  orders, InsertOrder,
  orderItems, InsertOrderItem,
  gameSessions, InsertGameSession,
  gameResults, InsertGameResult,
  prizeCodes, InsertPrizeCode
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ STORES ============

export async function getAllStores() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stores).where(eq(stores.isActive, 1)).orderBy(desc(stores.createdAt));
}

export async function getStoreById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(stores).where(eq(stores.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createStore(store: InsertStore) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result: any = await db.insert(stores).values(store);
  return Number(result.insertId);
}

export async function updateStore(id: number, updates: Partial<InsertStore>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(stores).set(updates).where(eq(stores.id, id));
}

// ============ CATEGORIES ============

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result: any = await db.insert(categories).values(category);
  return Number(result.insertId);
}

// ============ PRODUCTS ============

export async function getAllProducts(filters?: { categoryId?: number; storeId?: number }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(products.isActive, 1)];
  
  if (filters?.categoryId) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  }
  if (filters?.storeId) {
    conditions.push(eq(products.storeId, filters.storeId));
  }
  
  return db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductsByStore(storeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products)
    .where(and(eq(products.storeId, storeId), eq(products.isActive, 1)))
    .orderBy(desc(products.createdAt));
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result: any = await db.insert(products).values(product);
  return Number(result.insertId);
}

export async function updateProduct(id: number, updates: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(updates).where(eq(products.id, id));
}

// ============ CART ============

export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const items = await db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      product: products,
      store: stores,
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(eq(cartItems.userId, userId));
  
  return items;
}

export async function addToCart(item: InsertCartItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if item already exists in cart
  const existing = await db.select().from(cartItems)
    .where(and(
      eq(cartItems.userId, item.userId),
      eq(cartItems.productId, item.productId)
    ))
    .limit(1);
  
  if (existing.length > 0) {
    // Update quantity
    await db.update(cartItems)
      .set({ quantity: existing[0].quantity + (item.quantity || 1) })
      .where(eq(cartItems.id, existing[0].id));
    return existing[0].id;
  } else {
    // Insert new item
    const result: any = await db.insert(cartItems).values(item);
    return Number(result.insertId);
  }
}

export async function updateCartItemQuantity(id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
  }
}

export async function removeFromCart(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// ============ ORDERS ============

export async function createOrder(order: InsertOrder, items: Omit<InsertOrderItem, 'orderId'>[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Insert order
  const orderResult: any = await db.insert(orders).values(order);
  const orderId = Number(orderResult.insertId);
  
  // Insert order items
  const itemsWithOrderId: InsertOrderItem[] = items.map(item => ({ ...item, orderId }));
  await db.insert(orderItems).values(itemsWithOrderId);
  
  return orderId;
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function updateOrderStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set({ status: status as any }).where(eq(orders.id, id));
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

// ============ GAME SYSTEM ============

/**
 * Generate a unique prize code
 */
function generatePrizeCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing characters
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Pre-generate random results for a game session
 * Each result is an object with tree and leaf boolean values
 * 45% chance for user to win (one of them will be true based on user's choice)
 */
function generatePreDeterminedResults(totalAttempts: number): Array<{ tree: boolean; leaf: boolean }> {
  const results: Array<{ tree: boolean; leaf: boolean }> = [];
  
  for (let i = 0; i < totalAttempts; i++) {
    const random = Math.random();
    const userWins = random < 0.45; // 45% win rate
    
    if (userWins) {
      // Randomly choose which option wins (50/50 between tree and leaf)
      const treeWins = Math.random() < 0.5;
      results.push({
        tree: treeWins,
        leaf: !treeWins,
      });
    } else {
      // User loses - both are false (neither wins)
      results.push({
        tree: false,
        leaf: false,
      });
    }
  }
  
  return results;
}

/**
 * Create a new game session with pre-generated results
 */
export async function createGameSession(session: InsertGameSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Generate pre-determined results for this session
  const preGeneratedResults = generatePreDeterminedResults(session.totalAttempts || 1);
  
  // Store results as JSON string
  const sessionWithResults = {
    ...session,
    preGeneratedResults: JSON.stringify(preGeneratedResults),
  };
  
  const result: any = await db.insert(gameSessions).values(sessionWithResults);
  return Number(result.insertId);
}

/**
 * Get active game session for user and product
 */
export async function getActiveGameSession(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(gameSessions)
    .where(and(
      eq(gameSessions.userId, userId),
      eq(gameSessions.productId, productId),
      eq(gameSessions.status, 'active')
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get game session by ID
 */
export async function getGameSessionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(gameSessions).where(eq(gameSessions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Update game session
 */
export async function updateGameSession(id: number, updates: Partial<InsertGameSession>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(gameSessions).set(updates).where(eq(gameSessions.id, id));
}

/**
 * Play a game round using pre-generated results
 * Returns true if user won, false if lost
 */
export async function playGameRound(sessionId: number, userId: number, productId: number, choice: 'tree' | 'leaf'): Promise<{ isWin: boolean; result: 'tree' | 'leaf' }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get session
  const session = await getGameSessionById(sessionId);
  if (!session) throw new Error("Game session not found");
  if (session.status !== 'active') throw new Error("Game session is not active");
  if (session.attemptsUsed >= session.totalAttempts) throw new Error("No attempts remaining");
  
  // Parse pre-generated results
  const preGeneratedResults: Array<{ tree: boolean; leaf: boolean }> = session.preGeneratedResults 
    ? JSON.parse(session.preGeneratedResults) 
    : [];
  
  if (preGeneratedResults.length === 0 || session.attemptsUsed >= preGeneratedResults.length) {
    throw new Error("No pre-generated results available");
  }
  
  // Get the pre-determined result for this attempt
  const currentResult = preGeneratedResults[session.attemptsUsed];
  
  // Check if user's choice matches the pre-generated winning option
  const isWin = currentResult[choice];
  
  // Determine what result to show
  let result: 'tree' | 'leaf';
  if (isWin) {
    result = choice; // User chose correctly
  } else {
    // User chose wrong - show the opposite or show that neither won
    if (currentResult.tree || currentResult.leaf) {
      // One of them was winning, show the other
      result = choice === 'tree' ? 'leaf' : 'tree';
    } else {
      // Neither was winning (both false), randomly show one
      result = choice === 'tree' ? 'leaf' : 'tree';
    }
  }
  
  // Save game result
  await db.insert(gameResults).values({
    sessionId,
    userId,
    productId,
    choice,
    result,
    isWin: isWin ? 1 : 0,
  });
  
  // Update session
  const newWins = isWin ? session.wins + 1 : session.wins;
  const newAttemptsUsed = session.attemptsUsed + 1;
  
  let newStatus: 'active' | 'won' | 'lost' | 'expired' = session.status;
  let prizeCode = session.prizeCode;
  
  // Check if user won the product (5 wins)
  if (newWins >= 5) {
    newStatus = 'won' as const;
    prizeCode = generatePrizeCode();
    
    // Create prize code entry
    await db.insert(prizeCodes).values({
      code: prizeCode,
      sessionId,
      userId,
      productId,
      status: 'active',
    });
  } else if (newAttemptsUsed >= session.totalAttempts && newWins < 5) {
    // Used all attempts but didn't win
    newStatus = 'lost' as const;
  }
  
  await updateGameSession(sessionId, {
    wins: newWins,
    attemptsUsed: newAttemptsUsed,
    status: newStatus,
    prizeCode,
  });
  
  return { isWin, result };
}

/**
 * Get game history for a user
 */
export async function getUserGameHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const sessions = await db
    .select({
      session: gameSessions,
      product: products,
    })
    .from(gameSessions)
    .leftJoin(products, eq(gameSessions.productId, products.id))
    .where(eq(gameSessions.userId, userId))
    .orderBy(desc(gameSessions.createdAt));
  
  return sessions;
}

/**
 * Get game results for a session
 */
export async function getSessionGameResults(sessionId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(gameResults)
    .where(eq(gameResults.sessionId, sessionId))
    .orderBy(desc(gameResults.createdAt));
}

/**
 * Get prize code by code string
 */
export async function getPrizeCodeByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select({
      prizeCode: prizeCodes,
      product: products,
      user: users,
    })
    .from(prizeCodes)
    .leftJoin(products, eq(prizeCodes.productId, products.id))
    .leftJoin(users, eq(prizeCodes.userId, users.id))
    .where(eq(prizeCodes.code, code))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Redeem a prize code
 */
export async function redeemPrizeCode(code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const prizeData = await getPrizeCodeByCode(code);
  if (!prizeData) throw new Error("Prize code not found");
  if (prizeData.prizeCode.status !== 'active') throw new Error("Prize code already used or expired");
  
  await db.update(prizeCodes)
    .set({ 
      status: 'redeemed',
      redeemedAt: new Date(),
    })
    .where(eq(prizeCodes.code, code));
  
  return prizeData;
}

/**
 * Get all prize codes (admin)
 */
export async function getAllPrizeCodes() {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select({
      prizeCode: prizeCodes,
      product: products,
      user: users,
    })
    .from(prizeCodes)
    .leftJoin(products, eq(prizeCodes.productId, products.id))
    .leftJoin(users, eq(prizeCodes.userId, users.id))
    .orderBy(desc(prizeCodes.createdAt));
}
