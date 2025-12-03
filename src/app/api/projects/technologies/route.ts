import { NextResponse } from "next/server";

import { getCachedData } from "@/lib/redis-request-cache";
import { supabase, type Technology } from "@/lib/supabase";

// Response interface for technologies endpoint
export interface TechnologiesResponse {
  technologies: Technology[];
  error?: string;
}

// Cache TTL: 24 hours (matching HTTP Cache-Control)
const CACHE_TTL_SECONDS = 86400;

export async function GET() {
  try {
    // Use Redis-backed distributed cache with 24-hour TTL
    const { data, error } = await getCachedData(
      "all",
      async () => {
        // Execute query to get all technologies
        return await supabase
          .from("technologies")
          .select("*")
          .order("category", { ascending: true })
          .order("name", { ascending: true });
      },
      {
        ttl: CACHE_TTL_SECONDS,
        prefix: "api:technologies",
      },
    );

    // Handle database errors
    if (error) {
      console.error("Database error fetching technologies:", error);
      return NextResponse.json(
        {
          technologies: [],
          error: "Failed to fetch technologies from database",
        } as TechnologiesResponse,
        { status: 500 },
      );
    }

    // Handle case where no technologies exist
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          technologies: [],
        } as TechnologiesResponse,
        { status: 200 },
      );
    }

    // Type assertion for Supabase query result
    const technologiesData = data as Technology[];

    // Return with cache headers (cache for 24 hours as technologies don't change frequently)
    return NextResponse.json(
      {
        technologies: technologiesData,
      } as TechnologiesResponse,
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=172800",
        },
      },
    );
  } catch (error) {
    console.error("Unexpected error in technologies endpoint:", error);
    return NextResponse.json(
      {
        technologies: [],
        error: "Internal server error",
      } as TechnologiesResponse,
      { status: 500 },
    );
  }
}
