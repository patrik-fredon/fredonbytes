/**
 * Type definitions for the About page feature
 * 
 * @fileoverview Defines the data structures for team members and company story
 * @module lib/types/about
 */

/**
 * Represents an individual team member with their professional profile information
 */
export interface TeamMember {
  /** The team member's full name (2-100 characters) */
  name: string;
  
  /** The team member's job title/role (2-100 characters) */
  position: string;
  
  /** URL or relative path to the team member's professional photo */
  photo: string;
  
  /** The team member's personal motto or tagline (max 200 characters) */
  motto?: string;
  
  /** Professional summary describing background and expertise (50-1000 characters) */
  summary: string;
}

/**
 * Represents the emotional narrative about the company's founding and mission
 */
export interface CompanyStory {
  /** The main heading for the story section (10-200 characters) */
  title: string;
  
  /** Array of paragraphs containing the inspirational narrative (3-10 paragraphs, each 100-1000 characters) */
  content: string[];
  
  /** Name of the company founder (2-100 characters) */
  founder: string;
  
  /** Core mission statement (50-500 characters) */
  mission: string;
}

/**
 * Type guard to validate TeamMember object
 */
export function isValidTeamMember(obj: unknown): obj is TeamMember {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const member = obj as TeamMember;
  
  return (
    typeof member.name === 'string' &&
    member.name.length >= 2 &&
    member.name.length <= 100 &&
    typeof member.position === 'string' &&
    member.position.length >= 2 &&
    member.position.length <= 100 &&
    typeof member.photo === 'string' &&
    member.photo.length > 0 &&
    (member.motto === undefined || 
      (typeof member.motto === 'string' && member.motto.length <= 200)) &&
    typeof member.summary === 'string' &&
    member.summary.length >= 50 &&
    member.summary.length <= 1000
  );
}
