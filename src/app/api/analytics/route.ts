import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { sanitizeString } from '@/app/lib/input-sanitization';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zod schema for Web Vitals metric validation
    const webVitalsSchema = z.object({
      name: z.string().min(1).max(50),
      value: z.number().min(0),
      rating: z.enum(['good', 'needs-improvement', 'poor']),
      delta: z.number(),
      id: z.string().max(100),
      navigationType: z.string().max(50).optional(),
    });

    // Validate the metric data
    const validationResult = webVitalsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid metric data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const metric = validationResult.data;

    // Sanitize string fields to prevent XSS
    const sanitizedMetric = {
      ...metric,
      name: sanitizeString(metric.name),
      id: sanitizeString(metric.id),
      navigationType: metric.navigationType ? sanitizeString(metric.navigationType) : undefined,
    };

    // Log the metric (in production, you would send this to your analytics service)
    // Using console.warn for visibility (ESLint allows warn/error)
    console.warn('[Web Vitals Analytics]', {
      timestamp: new Date().toISOString(),
      metric: sanitizedMetric.name,
      value: sanitizedMetric.value,
      rating: sanitizedMetric.rating,
      delta: sanitizedMetric.delta,
      id: sanitizedMetric.id,
      navigationType: sanitizedMetric.navigationType,
    });

    // Here you could integrate with analytics services like:
    // - Google Analytics 4
    // - Vercel Analytics
    // - Custom analytics database
    // - Third-party monitoring services (DataDog, New Relic, etc.)
    
    // Example: Store in database (commented out - implement as needed)
    // await storeMetricInDatabase(sanitizedMetric);

    // Example: Send to external analytics service (commented out - implement as needed)
    // await sendToAnalyticsService(sanitizedMetric);

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
