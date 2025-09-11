import type { Context } from "@netlify/functions";
import { insertCategorySchema } from "../../shared/schema";
import { z } from "zod";
import { netlifyStorage } from "./lib/storage";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const method = request.method;
  
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    switch (method) {
      case "GET":
        const categories = await netlifyStorage.getCategories();
        return new Response(JSON.stringify(categories), {
          status: 200,
          headers,
        });

      case "POST":
        const body = await request.json();
        const categoryData = insertCategorySchema.parse(body);
        const category = await netlifyStorage.createCategory(categoryData);
        return new Response(JSON.stringify(category), {
          status: 201,
          headers,
        });

      default:
        return new Response(JSON.stringify({ message: "Method not allowed" }), {
          status: 405,
          headers,
        });
    }
  } catch (error) {
    console.error("Categories function error:", error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ message: "Invalid category data", errors: error.errors }),
        { status: 400, headers }
      );
    }
    
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers }
    );
  }
};