import { Metadata } from 'next'
import UrlTrimmer from '@/components/UrlTrimmer'

export const metadata: Metadata = {
  title: 'Trim URL(s) to Root | Rabbit Rank Tools',
  description: 'Efficiently extract root domains from multiple URLs with our URL trimmer. Perfect for SEO professionals, digital marketers, and web developers.',
}

export default function UrlTrimmerPage() {
  return <UrlTrimmer />
}

