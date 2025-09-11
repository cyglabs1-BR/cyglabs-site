import type { Context } from "@netlify/functions";
import { insertProductSchema } from "../../shared/schema";
import { z } from "zod";
import { netlifyStorage } from "./lib/storage";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const method = request.method;
  const pathParts = url.pathname.split('/').filter(Boolean);
  // Extract ID from path - Netlify forwards as /.netlify/functions/products/[id]
  const productId = pathParts[pathParts.length - 1]; // Last segment is the ID
  
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    switch (method) {
      case "GET":
        // Handle /api/products/:id
        if (pathParts.length > 2 && productId !== 'products') {
          const product = await netlifyStorage.getProductById(productId);
          if (!product) {
            return new Response(JSON.stringify({ message: "Product not found" }), {
              status: 404,
              headers,
            });
          }
          return new Response(JSON.stringify(product), {
            status: 200,
            headers,
          });
        }
        
        // Handle /api/products with query params
        const { searchParams } = url;
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const featured = searchParams.get('featured');
        
        let products: any[];
        if (featured === "true") {
          products = await netlifyStorage.getFeaturedProducts();
        } else if (search) {
          products = await netlifyStorage.searchProducts(search);
        } else if (category) {
          const categoryObj = await netlifyStorage.getCategoryBySlug(category);
          if (categoryObj) {
            products = await netlifyStorage.getProductsByCategory(categoryObj.id);
          } else {
            products = [];
          }
        } else {
          products = await netlifyStorage.getProducts();
        }
        
        return new Response(JSON.stringify(products), {
          status: 200,
          headers,
        });

      case "POST":
        const body = await request.json();
        const productData = insertProductSchema.parse(body);
        const product = await netlifyStorage.createProduct(productData);
        return new Response(JSON.stringify(product), {
          status: 201,
          headers,
        });

      case "PUT":
        if (pathParts.length > 2 && productId !== 'products') {
          const updates = await request.json();
          const updatedProduct = await netlifyStorage.updateProduct(productId, updates);
          if (!updatedProduct) {
            return new Response(JSON.stringify({ message: "Product not found" }), {
              status: 404,
              headers,
            });
          }
          return new Response(JSON.stringify(updatedProduct), {
            status: 200,
            headers,
          });
        }
        return new Response(JSON.stringify({ message: "Product ID required" }), {
          status: 400,
          headers,
        });

      case "DELETE":
        if (pathParts.length > 2 && productId !== 'products') {
          const deleted = await netlifyStorage.deleteProduct(productId);
          if (!deleted) {
            return new Response(JSON.stringify({ message: "Product not found" }), {
              status: 404,
              headers,
            });
          }
          return new Response(JSON.stringify({ message: "Product deleted successfully" }), {
            status: 200,
            headers,
          });
        }
        return new Response(JSON.stringify({ message: "Product ID required" }), {
          status: 400,
          headers,
        });

      default:
        return new Response(JSON.stringify({ message: "Method not allowed" }), {
          status: 405,
          headers,
        });
    }
  } catch (error) {
    console.error("Products function error:", error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ message: "Invalid product data", errors: error.errors }),
        { status: 400, headers }
      );
    }
    
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers }
    );
  }
};