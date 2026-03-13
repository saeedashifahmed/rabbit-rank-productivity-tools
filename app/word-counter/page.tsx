import { Metadata } from 'next'
import WordCounter from '@/components/WordCounter'

export const metadata: Metadata = {
  title: 'Word Counter | Rabbit Rank Tools',
  description: 'Count words, characters, sentences, and paragraphs with our free online word counter tool. Perfect for writers, students, and professionals.',
}

export default function WordCounterPage() {
  return <WordCounter />
}

