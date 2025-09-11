import type { Context } from "@netlify/functions";
import { netlifyStorage } from "./lib/storage";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const method = request.method;
  
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    switch (method) {
      case "GET":
        const subscriptions = await netlifyStorage.getActiveSubscriptions();
        return new Response(JSON.stringify(subscriptions), {
          status: 200,
          headers,
        });

      default:
        return new Response(JSON.stringify({ message: "Method not allowed" }), {
          status: 405,
          headers,
        });
    }
  } catch (error) {
    console.error("Subscriptions function error:", error);
    
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers }
    );
  }
};