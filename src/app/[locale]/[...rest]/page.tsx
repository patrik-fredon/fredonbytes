import { notFound } from 'next/navigation';

// Catch-all route for unknown localized paths
// This ensures all unmatched routes within [locale] show the custom 404 page
export default function CatchAllPage() {
  notFound();
}
