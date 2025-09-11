import { 
  type Category, type Product, type Subscription, type Customer, type Order, type OrderItem, type CartItem, type ProductReview, type CustomerSubscription,
  type InsertCategory, type InsertProduct, type InsertSubscription, type InsertCustomer, type InsertOrder, type InsertOrderItem, type InsertCartItem, type InsertProductReview, type InsertCustomerSubscription,
  categories, products, subscriptions, customers, orders, orderItems, cartItems, productReviews, customerSubscriptions
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Subscriptions
  getSubscriptions(): Promise<Subscription[]>;
  getActiveSubscriptions(): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;

  // Customers
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;

  // Shopping Cart
  getCartItems(sessionId: string, customerId?: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string, customerId?: string): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItems(orderId: string, items: InsertOrderItem[]): Promise<OrderItem[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  updateOrderPaymentStatus(id: string, paymentStatus: string, paymentId?: string): Promise<Order | undefined>;

  // Reviews
  getProductReviews(productId: string): Promise<ProductReview[]>;
  createReview(review: InsertProductReview): Promise<ProductReview>;
  approveReview(id: string): Promise<ProductReview | undefined>;

  // Customer Subscriptions
  getCustomerSubscriptions(customerId: string): Promise<CustomerSubscription[]>;
  createCustomerSubscription(subscription: InsertCustomerSubscription): Promise<CustomerSubscription>;
  updateSubscriptionStatus(id: string, status: string): Promise<CustomerSubscription | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    // Check if data already exists
    const existingCategories = await db.select().from(categories).limit(1);
    if (existingCategories.length > 0) {
      return; // Data already initialized
    }

    // Initialize categories
    const defaultCategories = await db.insert(categories).values([
      { name: "Animais", icon: "fas fa-paw", slug: "animais" },
      { name: "Utilidades para o Lar", icon: "fas fa-home", slug: "utilidades" },
      { name: "Enfeites", icon: "fas fa-star", slug: "enfeites" },
      { name: "Lembranças", icon: "fas fa-gift", slug: "lembrancas" },
      { name: "Festas", icon: "fas fa-birthday-cake", slug: "festas" },
    ]).returning();

    // Initialize products
    await db.insert(products).values([
      {
        name: "Dragão Fantasia",
        description: "Miniatura detalhada para pintura",
        price: "25.00",
        categoryId: defaultCategories[0].id,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stlFileUrl: null,
        printType: "resin",
        featured: true,
      },
      {
        name: "Vaso Geométrico",
        description: "Decoração moderna para casa",
        price: "18.00",
        categoryId: defaultCategories[1].id,
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stlFileUrl: null,
        printType: "filament",
        featured: true,
      },
      {
        name: "Gatinho Fofo",
        description: "Perfeito para crianças",
        price: "15.00",
        categoryId: defaultCategories[0].id,
        imageUrl: "https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stlFileUrl: null,
        printType: "resin",
        featured: true,
      },
      {
        name: "Utensílio Cozinha",
        description: "Funcional e durável",
        price: "12.00",
        categoryId: defaultCategories[1].id,
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stlFileUrl: null,
        printType: "filament",
        featured: true,
      },
    ]);

    // Initialize subscriptions
    await db.insert(subscriptions).values([
      {
        name: "Premium Mensal",
        description: "Acesso a modelos exclusivos e descontos",
        monthlyPrice: "29.90",
        yearlyPrice: "299.90",
        features: [
          "Acesso a modelos exclusivos",
          "20% de desconto em todas as compras",
          "Suporte prioritário",
          "Tutoriais avançados de pintura"
        ],
        active: true,
      },
    ]);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    return await db.select().from(products).where(
      sql`LOWER(${products.name}) LIKE ${lowerQuery} OR LOWER(${products.description}) LIKE ${lowerQuery}`
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    return await db.select().from(subscriptions);
  }

  async getActiveSubscriptions(): Promise<Subscription[]> {
    return await db.select().from(subscriptions).where(eq(subscriptions.active, true));
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db.insert(subscriptions).values(insertSubscription).returning();
    return subscription;
  }

  // Customers
  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer;
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db.insert(customers).values(insertCustomer).returning();
    return customer;
  }

  // Shopping Cart
  async getCartItems(sessionId: string, customerId?: string): Promise<CartItem[]> {
    if (customerId) {
      return await db.select().from(cartItems).where(eq(cartItems.customerId, customerId));
    } else {
      return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
    }
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existing = item.customerId 
      ? await db.select().from(cartItems).where(
          and(eq(cartItems.customerId, item.customerId!), eq(cartItems.productId, item.productId))
        )
      : await db.select().from(cartItems).where(
          and(eq(cartItems.sessionId, item.sessionId), eq(cartItems.productId, item.productId))
        );

    if (existing.length > 0) {
      // Update quantity
      const [updatedItem] = await db.update(cartItems)
        .set({ quantity: existing[0].quantity + item.quantity })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return updatedItem;
    } else {
      // Insert new item
      const [newItem] = await db.insert(cartItems).values(item).returning();
      return newItem;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const [item] = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return item;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async clearCart(sessionId: string, customerId?: string): Promise<void> {
    if (customerId) {
      await db.delete(cartItems).where(eq(cartItems.customerId, customerId));
    } else {
      await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    }
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async addOrderItems(orderId: string, items: InsertOrderItem[]): Promise<OrderItem[]> {
    const orderItemsData = items.map(item => ({ ...item, orderId }));
    return await db.insert(orderItems).values(orderItemsData).returning();
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return order;
  }

  async updateOrderPaymentStatus(id: string, paymentStatus: string, paymentId?: string): Promise<Order | undefined> {
    const updates: any = { paymentStatus };
    if (paymentId) updates.paymentId = paymentId;
    
    const [order] = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    return order;
  }

  // Reviews
  async getProductReviews(productId: string): Promise<ProductReview[]> {
    return await db.select().from(productReviews)
      .where(and(eq(productReviews.productId, productId), eq(productReviews.approved, true)))
      .orderBy(desc(productReviews.createdAt));
  }

  async createReview(review: InsertProductReview): Promise<ProductReview> {
    const [newReview] = await db.insert(productReviews).values(review).returning();
    return newReview;
  }

  async approveReview(id: string): Promise<ProductReview | undefined> {
    const [review] = await db.update(productReviews).set({ approved: true }).where(eq(productReviews.id, id)).returning();
    return review;
  }

  // Customer Subscriptions
  async getCustomerSubscriptions(customerId: string): Promise<CustomerSubscription[]> {
    return await db.select().from(customerSubscriptions)
      .where(eq(customerSubscriptions.customerId, customerId))
      .orderBy(desc(customerSubscriptions.createdAt));
  }

  async createCustomerSubscription(subscription: InsertCustomerSubscription): Promise<CustomerSubscription> {
    const [newSubscription] = await db.insert(customerSubscriptions).values(subscription).returning();
    return newSubscription;
  }

  async updateSubscriptionStatus(id: string, status: string): Promise<CustomerSubscription | undefined> {
    const [subscription] = await db.update(customerSubscriptions).set({ status }).where(eq(customerSubscriptions.id, id)).returning();
    return subscription;
  }
}

export const storage = new DatabaseStorage();
