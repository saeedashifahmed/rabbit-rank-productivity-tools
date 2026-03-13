import { Metadata } from 'next'
import WordCounter from '@/components/WordCounter'

export const metadata: Metadata = {
  title: 'Free Online Word Counter — Count Words, Characters & Sentences | Rabbit Rank Tools',
  description: 'Count words, characters (with and without spaces), sentences, paragraphs, and reading time instantly. Free online word counter for writers, students, bloggers, and SEO professionals.',
  openGraph: {
    title: 'Free Online Word Counter — Count Words, Characters & Sentences',
    description: 'Analyze text in real-time: word count, character count, sentences, paragraphs, reading time, and top keywords. Completely free.',
    url: 'https://tools.rabbitrank.com/word-counter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Word Counter Tool',
    description: 'Count words, characters, sentences, and paragraphs with real-time precision. Free for writers and SEO professionals.',
  },
  alternates: {
    canonical: 'https://tools.rabbitrank.com/word-counter',
  },
}

export default function WordCounterPage() {
  return <WordCounter />
}

