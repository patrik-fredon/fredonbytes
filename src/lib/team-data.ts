/**
 * Static team member data for the About page
 * 
 * @fileoverview Contains the team member profiles displayed on the About page
 * @module lib/team-data
 */

import type { TeamMember } from './types/about';

/**
 * Array of team members with their professional profiles
 * Expected scale: 6-10 team members
 */
export const teamMembers: TeamMember[] = [
  {
    name: 'Fredon',
    position: 'Founder & CEO',
    photo: '/images/team/fredon.jpg',
    motto: 'Building the digital army, one solution at a time',
    summary: 'Experienced developer and entrepreneur who founded FredonBytes with a vision to create an all-in-one digital army for businesses. With years of experience in software development and a passion for innovation, Fredon leads the team in delivering cutting-edge solutions that empower clients to succeed in the digital landscape.',
  },
  // Additional team members can be added here following the same structure
  // Example:
  // {
  //   name: 'Team Member Name',
  //   position: 'Job Title',
  //   photo: '/images/team/member-photo.jpg',
  //   motto: 'Personal motto or tagline',
  //   summary: 'Professional background and expertise description...',
  // },
];

/**
 * Helper function to get team member by name
 */
export function getTeamMemberByName(name: string): TeamMember | undefined {
  return teamMembers.find((member) => member.name === name);
}

/**
 * Helper function to get total team member count
 */
export function getTeamMemberCount(): number {
  return teamMembers.length;
}
