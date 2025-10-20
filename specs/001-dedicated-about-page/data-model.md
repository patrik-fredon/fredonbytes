# Data Model

**Feature**: Dedicated About Page
**Date**: 2025-10-20
**Status**: Complete

## Overview

The About page uses a simple data model with static content for team member profiles and company story. All data is stored as static TypeScript constants and JSON translations.

## Entities

### TeamMember

Represents an individual team member with their professional profile information.

**Attributes**:
- `name` (string, required): The team member's full name
- `position` (string, required): The team member's job title/role
- `photo` (string, required): URL/path to the team member's professional photo
- `motto` (string, optional): The team member's personal motto or tagline
- `summary` (string, required): Professional summary describing the team member's background and expertise

**Validation Rules**:
- `name`: Non-empty string, 2-100 characters
- `position`: Non-empty string, 2-100 characters
- `photo`: Valid URL or relative path to image file
- `motto`: Optional, max 200 characters if provided
- `summary`: Non-empty string, 50-1000 characters

**Relationships**:
- None (standalone entity)

**Usage**:
```typescript
interface TeamMember {
  name: string;
  position: string;
  photo: string;
  motto?: string;
  summary: string;
}
```

### CompanyStory

Represents the emotional narrative about the company's founding and mission.

**Attributes**:
- `title` (string): The main heading for the story section
- `content` (string[]): Array of paragraphs containing the inspirational narrative
- `founder` (string): Name of the company founder
- `mission` (string): Core mission statement

**Validation Rules**:
- `title`: Non-empty string, 10-200 characters
- `content`: Array of 3-10 paragraphs, each 100-1000 characters
- `founder`: Non-empty string, 2-100 characters
- `mission`: Non-empty string, 50-500 characters

**Usage**:
```typescript
interface CompanyStory {
  title: string;
  content: string[];
  founder: string;
  mission: string;
}
```

## Data Storage

### Static Data Structure

Team member data is stored in `/src/lib/team-data.ts`:

```typescript
import { TeamMember } from './types/about';

export const teamMembers: TeamMember[] = [
  {
    name: 'Fredon',
    position: 'Founder & CEO',
    photo: '/images/team/fredon.jpg',
    motto: 'Building the digital army',
    summary: 'Experienced developer who founded FredonBytes...'
  },
  // ... additional team members
];
```

### Translation Data Structure

Content is internationalized using next-intl JSON files:

**messages/en.json**:
```json
{
  "about": {
    "companyStory": {
      "title": "Our Story: The Birth of the Digital Army",
      "content": [
        "In the ever-evolving landscape of technology...",
        "What started as a personal mission became..."
      ],
      "founder": "Fredon",
      "mission": "To be the all-in-one digital army that businesses need"
    },
    "team": {
      "title": "Meet Our Team",
      "members": []
    }
  }
}
```

## Data Flow

1. **Static Loading**: Team member data loaded from `team-data.ts` at build time
2. **Translation Loading**: Content loaded from JSON files based on current locale
3. **Component Rendering**: Data passed as props to React components
4. **Image Loading**: Photos loaded with lazy loading and error fallbacks

## Constraints

- **Static Only**: No dynamic data loading or API calls
- **Light Implementation**: No complex data validation or transformation
- **Expected Scale**: 6-10 team members maximum
- **Internationalization**: All user-facing content must be translatable

## Validation Strategy

- **TypeScript**: Strict typing ensures compile-time validation
- **Build-time**: Static data validated during build process
- **Runtime**: Graceful degradation for missing or invalid data
- **Testing**: Component tests validate data structure compliance

## Migration Notes

- Existing homepage About section data can be migrated to this structure
- Team member photos should be optimized WebP format
- Translation keys should follow existing project conventions</content>
<parameter name="path">/mnt/git/fredonbytes/specs/001-dedicated-about-page/data-model.md