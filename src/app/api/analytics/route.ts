import { NextRequest, NextResponse } from 'next/server';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType?: string;
}

export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalsMetric = await request.json();

    // Validate that we have the required fields
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }

    // Log the metric (in production, you would send this to your analytics service)
    // Using console.warn for visibility (ESLint allows warn/error)
    console.warn('[Web Vitals Analytics]', {
      timestamp: new Date().toISOString(),
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    });

    // Here you could integrate with analytics services like:
    // - Google Analytics 4
    // - Vercel Analytics
    // - Custom analytics database
    // - Third-party monitoring services (DataDog, New Relic, etc.)
    
    // Example: Store in database (commented out - implement as needed)
    // await storeMetricInDatabase(metric);

    // Example: Send to external analytics service (commented out - implement as needed)
    // await sendToAnalyticsService(metric);

    return NextResponse.json(
      { success: true, message: 'Metric received' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing Web Vitals metric:', error);
    
    // Return success even on error to avoid disrupting user experience
    return NextResponse.json(
      { success: true, message: 'Metric received' },
      { status: 200 }
    );
  }
}

// Disable caching for this endpoint
export const dynamic = 'force-dynamic';
