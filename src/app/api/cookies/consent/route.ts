import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { sanitizeString } from '@/app/lib/input-sanitization';
import { supabase } from '@/app/lib/supabase';

// Zod validation schema for cookie preferences
const cookiePreferencesSchema = z.object({
  session_id: z.string().uuid(),
  essential: z.boolean().default(true),
  analytics: z.boolean().default(false),
  marketing: z.boolean().default(false),
  preferences: z.boolean().default(false),
  consent_version: z.number().int().positive().default(1),
});

// Helper function to anonymize IP address using SHA-256
function anonymizeIpAddress(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

// Helper function to get client IP address
function getClientIp(request: NextRequest): string {
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to a default value if no IP is found
  return 'unknown';
}

/**
 * POST /api/cookies/consent
 * Store user cookie consent preferences
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validated = cookiePreferencesSchema.parse(body);
    
    // Get client information
    const clientIp = getClientIp(request);
    const ipAddressHash = anonymizeIpAddress(clientIp);
    const rawUserAgent = request.headers.get('user-agent') || '';
    // Sanitize user agent to prevent XSS attacks
    const userAgent = rawUserAgent ? sanitizeString(rawUserAgent) : null;
    
    // Check if consent already exists for this session
    const { data: existingConsent } = await supabase
      .from('cookie_consents')
      .select('id')
      .eq('session_id', validated.session_id)
      .single();
    
    if (existingConsent) {
      // Update existing consent
      const { error: updateError } = await supabase
        .from('cookie_consents')
        .update({
          ip_address_hash: ipAddressHash,
          user_agent: userAgent,
          consent_version: validated.consent_version,
          essential_cookies: validated.essential,
          analytics_cookies: validated.analytics,
          marketing_cookies: validated.marketing,
          preferences_cookies: validated.preferences,
        })
        .eq('session_id', validated.session_id);
      
      if (updateError) {
        console.error('Error updating cookie consent:', updateError);
        return NextResponse.json(
          { error: 'Failed to update cookie consent', details: updateError.message },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        session_id: validated.session_id,
        message: 'Cookie consent updated successfully',
      });
    }
    
    // Insert new consent
    const { error: insertError } = await supabase
      .from('cookie_consents')
      .insert({
        session_id: validated.session_id,
        ip_address_hash: ipAddressHash,
        user_agent: userAgent,
        consent_version: validated.consent_version,
        essential_cookies: validated.essential,
        analytics_cookies: validated.analytics,
        marketing_cookies: validated.marketing,
        preferences_cookies: validated.preferences,
      });
    
    if (insertError) {
      console.error('Error storing cookie consent:', insertError);
      return NextResponse.json(
        { error: 'Failed to store cookie consent', details: insertError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      session_id: validated.session_id,
      message: 'Cookie consent stored successfully',
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Unexpected error in cookie consent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cookies/consent?session_id={id}
 * Retrieve user cookie consent preferences
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }
    
    // Validate session_id is a valid UUID
    const uuidSchema = z.string().uuid();
    try {
      uuidSchema.parse(sessionId);
    } catch {
      return NextResponse.json(
        { error: 'Invalid session_id format' },
        { status: 400 }
      );
    }
    
    // Fetch consent from database
    const { data, error } = await supabase
      .from('cookie_consents')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No consent found for this session
        return NextResponse.json(
          { consent: null, message: 'No consent found for this session' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching cookie consent:', error);
      return NextResponse.json(
        { error: 'Failed to fetch cookie consent', details: error.message },
        { status: 500 }
      );
    }
    
    // Return consent data (excluding sensitive fields)
    return NextResponse.json({
      success: true,
      consent: {
        session_id: data.session_id,
        consent_version: data.consent_version,
        essential_cookies: data.essential_cookies,
        analytics_cookies: data.analytics_cookies,
        marketing_cookies: data.marketing_cookies,
        preferences_cookies: data.preferences_cookies,
        consent_timestamp: data.consent_timestamp,
      },
    });
    
  } catch (error) {
    console.error('Unexpected error in cookie consent GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
