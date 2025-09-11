import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";
import multer, { type FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import express from "express";

// Setup multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  fileFilter: (req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === "application/octet-stream" || file.originalname.endsWith('.stl')) {
      cb(null, true);
    } else {
      cb(new Error("Only STL files are allowed"));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search, featured } = req.query;
      
      let products: any[];
      if (featured === "true") {
        products = await storage.getFeaturedProducts();
      } else if (search) {
        products = await storage.searchProducts(search as string);
      } else if (category) {
        const categoryObj = await storage.getCategoryBySlug(category as string);
        if (categoryObj) {
          products = await storage.getProductsByCategory(categoryObj.id);
        } else {
          products = [];
        }
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", upload.single("stlFile"), async (req: any, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      
      // Handle STL file upload
      if (req.file) {
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const filePath = path.join(uploadDir, fileName);
        fs.renameSync(req.file.path, filePath);
        productData.stlFileUrl = `/uploads/${fileName}`;
      }
      
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid product data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create product" });
      }
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const updates = req.body;
      const product = await storage.updateProduct(req.params.id, updates);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Subscriptions routes
  app.get("/api/subscriptions", async (req, res) => {
    try {
      const subscriptions = await storage.getActiveSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
  app.use("/uploads", express.static(uploadDir));

  const httpServer = createServer(app);
  return httpServer;
}
