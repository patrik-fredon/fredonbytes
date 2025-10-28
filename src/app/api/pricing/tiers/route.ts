import { NextRequest, NextResponse } from 'next/server';

import { supabase, type PricingTier } from '@/lib/supabase';

// Response interface for pricing tiers endpoint
export interface PricingTiersResponse {
  tiers: PricingTier[];
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const popular = searchParams.get('popular');
    const _locale = searchParams.get('locale') || 'en'; // Accept locale parameter for future use

    // Build query
    let query = supabase
      .from('pricing_tiers')
      .select('*')
      .eq('active', true)
      .order('type', { ascending: true });

    // Apply optional filters
    if (type && ['starter', 'professional', 'enterprise'].includes(type)) {
      query = query.eq('type', type);
    }

    if (popular === 'true') {
      query = query.eq('popular', true);
    }

    // Execute query
    const { data, error } = await query;

    // Handle database errors
    if (error) {
      console.error('Database error fetching pricing tiers:', error);
      return NextResponse.json(
        {
          tiers: [],
          error: 'Failed to fetch pricing tiers from database',
        } as PricingTiersResponse,
        { status: 500 }
      );
    }

    // Handle case where no tiers exist
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          tiers: [],
        } as PricingTiersResponse,
        { status: 200 }
      );
    }

    // Type assertion for Supabase query result
    const tiersData = data as PricingTier[];

    // Return with cache headers (cache for 1 hour as pricing doesn't change frequently)
    // Note: Multilingual content is stored in JSONB and returned as-is.
    // Client components handle locale-specific rendering based on the locale parameter or URL.
    return NextResponse.json(
      {
        tiers: tiersData,
      } as PricingTiersResponse,
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error in pricing tiers endpoint:', error);
    return NextResponse.json(
      {
        tiers: [],
        error: 'Internal server error',
      } as PricingTiersResponse,
      { status: 500 }
    );
  }
}