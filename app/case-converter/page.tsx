import { Metadata } from 'next'
import CaseConverter from '@/components/CaseConverter'

export const metadata: Metadata = {
  title: 'Free Case Converter — Uppercase, Lowercase, Title Case & More | Rabbit Rank Tools',
  description: 'Convert text between uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case, PascalCase, and CONSTANT_CASE instantly. Free online text case converter.',
  openGraph: {
    title: 'Free Case Converter — Transform Text Case Instantly',
    description: 'Convert text between 9 different cases: uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case, PascalCase, and CONSTANT_CASE.',
    url: 'https://tools.rabbitrank.com/case-converter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Case Converter — Transform Text Case Instantly',
    description: 'Convert text between 9 different cases instantly. Free online tool for writers, developers, and marketers.',
  },
  alternates: {
    canonical: 'https://tools.rabbitrank.com/case-converter',
  },
}

export default function CaseConverterPage() {
  return <CaseConverter />
}

