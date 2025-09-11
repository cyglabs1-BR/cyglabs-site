import { type Category, type Product, type Subscription, type InsertCategory, type InsertProduct, type InsertSubscription } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private subscriptions: Map<string, Subscription>;

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.subscriptions = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const defaultCategories: Category[] = [
      { id: randomUUID(), name: "Animais", icon: "fas fa-paw", slug: "animais" },
      { id: randomUUID(), name: "Utilidades para o Lar", icon: "fas fa-home", slug: "utilidades" },
      { id: randomUUID(), name: "Enfeites", icon: "fas fa-star", slug: "enfeites" },
      { id: randomUUID(), name: "Lembranças", icon: "fas fa-gift", slug: "lembrancas" },
      { id: randomUUID(), name: "Festas", icon: "fas fa-birthday-cake", slug: "festas" },
    ];

    defaultCategories.forEach(category => {
      this.categories.set(category.id, category);
    });

    // Initialize products
    const animalsCategory = defaultCategories[0];
    const utilitiesCategory = defaultCategories[1];
    const decorationsCategory = defaultCategories[2];

    const defaultProducts: Product[] = [
      {
        id: randomUUID(),
        name: "Dragão Fantasia",
        description: "Miniatura detalhada para pintura",
        price: "25.00",
        categoryId: animalsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stlFileUrl: null,
        printType: "resin",
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Vaso Geométrico",
        description: "Decoração moderna para casa",
        price: "18.00",
        categoryId: utilitiesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stlFileUrl: null,
        printType: "filament",
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Gatinho Fofo",
        description: "Perfeito para crianças",
        price: "15.00",
        categoryId: animalsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stlFileUrl: null,
        printType: "resin",
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Utensílio Cozinha",
        description: "Funcional e durável",
        price: "12.00",
        categoryId: utilitiesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        stlFileUrl: null,
        printType: "filament",
        featured: true,
        createdAt: new Date(),
      },
    ];

    defaultProducts.forEach(product => {
      this.products.set(product.id, product);
    });

    // Initialize subscriptions
    const defaultSubscriptions: Subscription[] = [
      {
        id: randomUUID(),
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
    ];

    defaultSubscriptions.forEach(subscription => {
      this.subscriptions.set(subscription.id, subscription);
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => 
      product.categoryId === categoryId
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date(),
      featured: insertProduct.featured ?? false,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values());
  }

  async getActiveSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(sub => sub.active);
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const subscription: Subscription = { 
      ...insertSubscription, 
      id,
      active: insertSubscription.active ?? true
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }
}

export const storage = new MemStorage();
