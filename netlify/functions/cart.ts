import type { Context } from "@netlify/functions";
import { insertCartItemSchema } from "../../shared/schema";
import { z } from "zod";
import { netlifyStorage } from "./lib/storage";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const method = request.method;
  const pathParts = url.pathname.split('/').filter(Boolean);
  // Extract ID from path - Netlify forwards as /.netlify/functions/cart/[id]
  const cartItemId = pathParts[pathParts.length - 1]; // Last segment is the ID
  
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
        const { searchParams } = url;
        const sessionId = searchParams.get('sessionId');
        const customerId = searchParams.get('customerId');
        
        if (!sessionId && !customerId) {
          return new Response(
            JSON.stringify({ message: "Session ID or Customer ID is required" }),
            { status: 400, headers }
          );
        }
        
        const cartItems = await netlifyStorage.getCartItems(sessionId || "", customerId || "");
        
        // Get product details for each cart item
        const cartWithProducts = await Promise.all(
          cartItems.map(async (item) => {
            const product = await netlifyStorage.getProductById(item.productId);
            return {
              ...item,
              product,
            };
          })
        );
        
        return new Response(JSON.stringify(cartWithProducts), {
          status: 200,
          headers,
        });

      case "POST":
        // Handle clear cart
        if (url.pathname.includes('/clear') || cartItemId === 'clear') {
          const body = await request.json();
          const { sessionId, customerId } = body;
          
          if (!sessionId && !customerId) {
            return new Response(
              JSON.stringify({ message: "Session ID or Customer ID is required" }),
              { status: 400, headers }
            );
          }
          
          await netlifyStorage.clearCart(sessionId, customerId);
          return new Response(
            JSON.stringify({ message: "Cart cleared successfully" }),
            { status: 200, headers }
          );
        }
        
        // Add item to cart
        const body = await request.json();
        const cartData = insertCartItemSchema.parse(body);
        const cartItem = await netlifyStorage.addToCart(cartData);
        return new Response(JSON.stringify(cartItem), {
          status: 201,
          headers,
        });

      case "PUT":
        if (pathParts.length > 2 && cartItemId !== 'cart') {
          const { quantity } = await request.json();
          
          if (!quantity || quantity < 1) {
            return new Response(
              JSON.stringify({ message: "Valid quantity is required" }),
              { status: 400, headers }
            );
          }
          
          const cartItem = await netlifyStorage.updateCartItem(cartItemId, quantity);
          
          if (!cartItem) {
            return new Response(
              JSON.stringify({ message: "Cart item not found" }),
              { status: 404, headers }
            );
          }
          
          return new Response(JSON.stringify(cartItem), {
            status: 200,
            headers,
          });
        }
        return new Response(JSON.stringify({ message: "Cart item ID required" }), {
          status: 400,
          headers,
        });

      case "DELETE":
        // Handle clear cart with DELETE method
        if (cartItemId === 'clear') {
          const body = await request.json();
          const { sessionId, customerId } = body;
          
          if (!sessionId && !customerId) {
            return new Response(
              JSON.stringify({ message: "Session ID or Customer ID is required" }),
              { status: 400, headers }
            );
          }
          
          await netlifyStorage.clearCart(sessionId, customerId);
          return new Response(
            JSON.stringify({ message: "Cart cleared successfully" }),
            { status: 200, headers }
          );
        }
        
        if (pathParts.length > 2 && cartItemId !== 'cart') {
          const removed = await netlifyStorage.removeFromCart(cartItemId);
          
          if (!removed) {
            return new Response(
              JSON.stringify({ message: "Cart item not found" }),
              { status: 404, headers }
            );
          }
          
          return new Response(
            JSON.stringify({ message: "Item removed from cart" }),
            { status: 200, headers }
          );
        }
        return new Response(JSON.stringify({ message: "Cart item ID required" }), {
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
    console.error("Cart function error:", error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ message: "Invalid cart data", errors: error.errors }),
        { status: 400, headers }
      );
    }
    
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers }
    );
  }
};