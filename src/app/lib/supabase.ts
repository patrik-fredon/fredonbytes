import { createClient } from '@supabase/supabase-js';

// TypeScript interfaces for database tables

// Localized string interface for multilingual content
export interface LocalizedString {
  en: string;
  cs: string;
  de: string;
}

export interface Question {
  id: string;
  question_text: LocalizedString;
  description?: LocalizedString | null;
  answer_type: 'short_text' | 'long_text' | 'single_choice' | 'multiple_choice' | 'checklist' | 'rating';
  required: boolean;
  display_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: LocalizedString;
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
export type AnswerValue = string | string[] | number;

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

export interface ContactSubmission {
  id?: string;
  session_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company?: string | null;
  project_type: string;
  budget: string;
  timeline: string;
  message: string;
  requirements?: string[] | null;
  newsletter_opt_in: boolean;
  privacy_accepted: boolean;
  locale: string;
  ip_address_hash?: string | null;
  user_agent?: string | null;
  survey_sent: boolean;
  survey_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  locale: string;
  subscribed_at?: string;
  unsubscribed_at?: string | null;
  active: boolean;
  source: string;
  created_at?: string;
}

// Survey system interfaces
export interface SurveyQuestion {
  id: string;
  question_text: LocalizedString;
  description?: LocalizedString | null;
  answer_type: 'short_text' | 'long_text' | 'single_choice' | 'multiple_choice' | 'checklist' | 'rating';
  required: boolean;
  display_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  options?: SurveyQuestionOption[];
}

export interface SurveyQuestionOption {
  id: string;
  question_id: string;
  option_text: LocalizedString;
  display_order: number;
  created_at?: string;
}

export interface SurveySession {
  session_id: string;
  contact_submission_id?: string | null;
  created_at?: string;
  completed_at?: string | null;
  ip_address_hash?: string | null;
  user_agent?: string | null;
  locale: string;
}

export interface SurveyResponse {
  id?: string;
  session_id: string;
  question_id: string;
  answer_value: AnswerValue | number;
  submitted_at?: string;
}

// Project gallery interfaces
export interface Project {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  short_description?: LocalizedString | null;
  image_url: string;
  github_link?: string | null;
  live_demo_link?: string | null;
  technologies: string[];
  status: 'active' | 'completed' | 'archived';
  display_order: number;
  featured: boolean;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
}

type Database = {
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
      contact_submissions: {
        Row: ContactSubmission;
        Insert: Omit<ContactSubmission, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ContactSubmission, 'id' | 'created_at' | 'updated_at'>>;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: Omit<NewsletterSubscriber, 'id' | 'created_at' | 'subscribed_at'>;
        Update: Partial<Omit<NewsletterSubscriber, 'id' | 'created_at' | 'subscribed_at'>>;
      };
      survey_questions: {
        Row: SurveyQuestion;
        Insert: Omit<SurveyQuestion, 'id' | 'created_at' | 'updated_at' | 'options'>;
        Update: Partial<Omit<SurveyQuestion, 'id' | 'created_at' | 'updated_at' | 'options'>>;
      };
      survey_question_options: {
        Row: SurveyQuestionOption;
        Insert: Omit<SurveyQuestionOption, 'id' | 'created_at'>;
        Update: Partial<Omit<SurveyQuestionOption, 'id' | 'created_at'>>;
      };
      survey_sessions: {
        Row: SurveySession;
        Insert: Omit<SurveySession, 'created_at'>;
        Update: Partial<Omit<SurveySession, 'created_at'>>;
      };
      survey_responses: {
        Row: SurveyResponse;
        Insert: Omit<SurveyResponse, 'id' | 'submitted_at'>;
        Update: Partial<Omit<SurveyResponse, 'id' | 'submitted_at'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
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
