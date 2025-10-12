import { NextRequest, NextResponse } from 'next/server';

import { supabase, type Project } from '@/app/lib/supabase';

// Response interface for projects endpoint
export interface ProjectsResponse {
  projects: Project[];
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const _locale = searchParams.get('locale') || 'en'; // Accept locale parameter for future use

    // Build query
    let query = supabase
      .from('projects')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true });

    // Apply optional filters
    if (status && ['active', 'completed', 'archived'].includes(status)) {
      query = query.eq('status', status);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    // Execute query
    const { data, error } = await query;

    // Handle database errors
    if (error) {
      console.error('Database error fetching projects:', error);
      return NextResponse.json(
        {
          projects: [],
          error: 'Failed to fetch projects from database',
        } as ProjectsResponse,
        { status: 500 }
      );
    }

    // Handle case where no projects exist
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          projects: [],
        } as ProjectsResponse,
        { status: 200 }
      );
    }

    // Type assertion for Supabase query result
    const projectsData = data as Project[];

    // Return with cache headers (cache for 1 hour as projects don't change frequently)
    // Note: Multilingual content is stored in JSONB and returned as-is.
    // Client components handle locale-specific rendering based on the locale parameter or URL.
    return NextResponse.json(
      {
        projects: projectsData,
      } as ProjectsResponse,
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error in projects endpoint:', error);
    return NextResponse.json(
      {
        projects: [],
        error: 'Internal server error',
      } as ProjectsResponse,
      { status: 500 }
    );
  }
}
