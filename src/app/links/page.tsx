import type { Metadata } from 'next'

import LinkList from '../components/linktree/LinkList'
import ProfileHeader from '../components/linktree/ProfileHeader'

export const metadata: Metadata = {
  title: 'Links - Fredonbytes',
  description: 'All important links for Fredonbytes - Your All-in-One IT Powerhouse. Find our portfolio, gallery, support portal, and social media.',
  openGraph: {
    title: 'Links - Fredonbytes',
    description: 'All important links for Fredonbytes - Your All-in-One IT Powerhouse.',
    url: 'https://fredonbytes.cloud/links',
  },
  twitter: {
    title: 'Links - Fredonbytes',
    description: 'All important links for Fredonbytes - Your All-in-One IT Powerhouse.',
  },
}

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader />
        <LinkList />
      </div>
    </div>
  )
}