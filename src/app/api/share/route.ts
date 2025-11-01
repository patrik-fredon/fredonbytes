import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract shared data
    const title = formData.get('title') as string
    const text = formData.get('text') as string
    const url = formData.get('url') as string
    const files = formData.getAll('files') as File[]

    // Log the shared content (in production, you'd process this)
    console.log('Received shared content:', {
      title,
      text,
      url,
      fileCount: files.length,
      fileNames: files.map(f => f.name)
    })

    const referer = request.headers.get('referer') || request.url
    const locale = new URL(referer).pathname.match(/^\/([^/]+)/)?.[1] || 'en'
    const contactUrl = new URL(`/${locale}/contact`, request.url)
    if (title) contactUrl.searchParams.set('subject', title)
    if (text) contactUrl.searchParams.set('message', text)
    if (url) contactUrl.searchParams.set('url', url)

    return NextResponse.redirect(contactUrl)
  } catch (error) {
    console.error('Share target error:', error)
    return NextResponse.json(
      { error: 'Failed to process shared content' },
      { status: 500 }
    )
  }
}