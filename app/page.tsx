import { Metadata } from 'next'
import HomePage from '@/components/HomePage'

export const metadata: Metadata = {
  title: 'Rabbit Rank Tools - Professional Productivity Suite',
  description: 'Enhance your workflow with our suite of essential tools designed for professionals. Simple, efficient, and reliable solutions for everyday challenges.',
}

export default function Home() {
  return <HomePage />
}

