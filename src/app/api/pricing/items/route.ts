import { NextRequest, NextResponse } from "next/server";

import { getCachedData } from "@/lib/redis-request-cache";
import { supabase, type PricingItem } from "@/lib/supabase";

// Response interface for pricing items endpoint
export interface PricingItemsResponse {
  items: PricingItem[];
  error?: string;
}

// Cache TTL: 1 hour (matching HTTP Cache-Control)
const CACHE_TTL_SECONDS = 3600;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const _locale = searchParams.get("locale") || "en"; // Accept locale parameter for future use

    // Generate cache key from query parameters
    const cacheKey = searchParams.toString() || "all";

    // Use Redis-backed distributed cache with 1-hour TTL
    const { data, error } = await getCachedData(
      cacheKey,
      async () => {
        // Build query
        let query = supabase
          .from("pricing_items")
          .select("*")
          .eq("active", true)
          .order("category", { ascending: true })
          .order("base_price_eur", { ascending: true });

        // Apply optional category filter
        if (category) {
          query = query.eq("category", category);
        }

        // Execute query
        return await query;
      },
      {
        ttl: CACHE_TTL_SECONDS,
        prefix: "api:pricing-items",
      }
    );

    // Handle database errors
    if (error) {
      console.error("Database error fetching pricing items:", error);
      return NextResponse.json(
        {
          items: [],
          error: "Failed to fetch pricing items from database",
        } as PricingItemsResponse,
        { status: 500 },
      );
    }

    // Handle case where no items exist
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          items: [],
        } as PricingItemsResponse,
        { status: 200 },
      );
    }

    // Type assertion for Supabase query result
    const itemsData = data as PricingItem[];

    // Return with cache headers (cache for 1 hour as pricing doesn't change frequently)
    // Note: Multilingual content is stored in JSONB and returned as-is.
    // Client components handle locale-specific rendering based on the locale parameter or URL.
    return NextResponse.json(
      {
        items: itemsData,
      } as PricingItemsResponse,
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    );
  } catch (error) {
    console.error("Unexpected error in pricing items endpoint:", error);
    return NextResponse.json(
      {
        items: [],
        error: "Internal server error",
      } as PricingItemsResponse,
      { status: 500 },
    );
  }
}
