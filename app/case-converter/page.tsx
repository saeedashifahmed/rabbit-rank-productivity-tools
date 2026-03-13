import { Metadata } from 'next'
import CaseConverter from '@/components/CaseConverter'

export const metadata: Metadata = {
  title: 'Case Converter | Rabbit Rank Tools',
  description: 'Convert text between different cases instantly. Transform to uppercase, lowercase, title case, sentence case, and camelCase with our free online tool.',
}

export default function CaseConverterPage() {
  return <CaseConverter />
}

