import { eq, like, and, or } from "drizzle-orm";
import { getDb } from "./db";
import type {
  Category,
  Product,
  Subscription,
  CartItem,
  InsertCategory,
  InsertProduct,
  InsertCartItem,
} from "../../../shared/schema";
import { categories, products, subscriptions, cartItems } from "../../../shared/schema";

export class NetlifyStorage {
  private db = getDb();

  // Categories
  async getCategories(): Promise<Category[]> {
    return await this.db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await this.db.insert(categories).values(category).returning();
    return created;
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const [category] = await this.db.select().from(categories).where(eq(categories.slug, slug));
    return category || null;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await this.db.select().from(products);
  }

  async getProductById(id: string): Promise<Product | null> {
    const [product] = await this.db.select().from(products).where(eq(products.id, id));
    return product || null;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await this.db.select().from(products).where(eq(products.featured, true));
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await this.db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    const searchPattern = `%${searchTerm}%`;
    return await this.db
      .select()
      .from(products)
      .where(
        or(
          like(products.name, searchPattern),
          like(products.description, searchPattern)
        )
      );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await this.db.insert(products).values(product).returning();
    return created;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | null> {
    const [updated] = await this.db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return updated || null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const deleted = await this.db.delete(products).where(eq(products.id, id)).returning();
    return deleted.length > 0;
  }

  // Subscriptions
  async getActiveSubscriptions(): Promise<Subscription[]> {
    return await this.db.select().from(subscriptions).where(eq(subscriptions.active, true));
  }

  // Cart items
  async getCartItems(sessionId: string, customerId: string): Promise<CartItem[]> {
    if (customerId) {
      return await this.db.select().from(cartItems).where(eq(cartItems.customerId, customerId));
    } else {
      return await this.db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
    }
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existing = await this.db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.productId, cartItem.productId),
          cartItem.customerId 
            ? eq(cartItems.customerId, cartItem.customerId!)
            : eq(cartItems.sessionId, cartItem.sessionId)
        )
      );

    if (existing.length > 0) {
      // Update quantity instead of creating new item
      const [updated] = await this.db
        .update(cartItems)
        .set({ quantity: existing[0].quantity + cartItem.quantity })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await this.db.insert(cartItems).values(cartItem).returning();
    return created;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | null> {
    const [updated] = await this.db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return updated || null;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const deleted = await this.db.delete(cartItems).where(eq(cartItems.id, id)).returning();
    return deleted.length > 0;
  }

  async clearCart(sessionId: string, customerId: string): Promise<void> {
    if (customerId) {
      await this.db.delete(cartItems).where(eq(cartItems.customerId, customerId)).returning();
    } else {
      await this.db.delete(cartItems).where(eq(cartItems.sessionId, sessionId)).returning();
    }
  }
}

export const netlifyStorage = new NetlifyStorage();