import { Metadata } from 'next'
import UrlTrimmer from '@/components/UrlTrimmer'

export const metadata: Metadata = {
  title: 'Free URL Trimmer — Extract Root Domains in Bulk | Rabbit Rank Tools',
  description: 'Extract root domains from multiple URLs at once. Bulk URL trimmer with CSV export, deduplication, and clipboard copy. Free for SEO professionals, marketers, and developers.',
  openGraph: {
    title: 'Free URL Trimmer — Extract Root Domains in Bulk',
    description: 'Extract root domains from multiple URLs at once with CSV export and deduplication. Free for SEO professionals and marketers.',
    url: 'https://tools.rabbitrank.com/trim-urls-to-root',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free URL Trimmer — Extract Root Domains in Bulk',
    description: 'Bulk extract root domains from URLs. Export to CSV, deduplicate, and copy results. Free for SEO professionals.',
  },
  alternates: {
    canonical: 'https://tools.rabbitrank.com/trim-urls-to-root',
  },
}

export default function UrlTrimmerPage() {
  return <UrlTrimmer />
}

