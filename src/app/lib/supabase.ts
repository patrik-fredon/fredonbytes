import { createClient } from '@supabase/supabase-js';

// TypeScript interfaces for database tables

export interface Question {
  id: string;
  question_text: string;
  description: string | null;
  answer_type: 'short_text' | 'long_text' | 'single_choice' | 'multiple_choice' | 'checklist';
  required: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  display_order: number;
  created_at?: string;
}

export interface FormSession {
  session_id: string;
  created_at?: string;
  completed_at?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  newsletter_optin?: boolean;
  email?: string | null;
}

export interface FormResponse {
  id?: string;
  session_id: string;
  question_id: string;
  answer_value: AnswerValue;
  submitted_at?: string;
}

// Answer value type (union type for all answer types)
export type AnswerValue = string | string[];

// Database type definition for Supabase
export interface CookieConsent {
  id?: string;
  session_id: string;
  ip_address_hash: string;
  user_agent?: string | null;
  consent_timestamp?: string;
  consent_version: number;
  essential_cookies: boolean;
  analytics_cookies: boolean;
  marketing_cookies: boolean;
  preferences_cookies: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export type Database = {
  public: {
    Tables: {
      questions: {
        Row: Question;
        Insert: Omit<Question, 'id' | 'created_at' | 'updated_at' | 'options'>;
        Update: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at' | 'options'>>;
      };
      question_options: {
        Row: QuestionOption;
        Insert: Omit<QuestionOption, 'id' | 'created_at'>;
        Update: Partial<Omit<QuestionOption, 'id' | 'created_at'>>;
      };
      form_sessions: {
        Row: FormSession;
        Insert: Omit<FormSession, 'created_at'>;
        Update: Partial<Omit<FormSession, 'created_at'>>;
      };
      form_responses: {
        Row: FormResponse;
        Insert: Omit<FormResponse, 'id' | 'submitted_at'>;
        Update: Partial<Omit<FormResponse, 'id' | 'submitted_at'>>;
      };
      cookie_consents: {
        Row: CookieConsent;
        Insert: Omit<CookieConsent, 'id' | 'created_at' | 'updated_at' | 'consent_timestamp'>;
        Update: Partial<Omit<CookieConsent, 'id' | 'created_at' | 'updated_at' | 'consent_timestamp'>>;
      };
    };
  };
};

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No auth required for public forms
  },
});
