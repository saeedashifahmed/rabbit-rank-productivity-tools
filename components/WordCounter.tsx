'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { FileText, ChevronRight, BookOpen, LetterText, AlignLeft, Pilcrow, Space } from 'lucide-react'

export default function WordCounter() {
  const [text, setText] = useState('')
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    sentences: 0,
    paragraphs: 0,
    spaces: 0
  })

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const characters = text.length
    const sentences = text.split(/[.!?]+/).filter(Boolean).length
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length
    const spaces = text.split(' ').length - 1

    setStats({ words, characters, sentences, paragraphs, spaces })
  }, [text])

  const statItems = [
    { label: 'Words', value: stats.words, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { label: 'Characters', value: stats.characters, icon: LetterText, color: 'text-purple-600 bg-purple-50' },
    { label: 'Sentences', value: stats.sentences, icon: AlignLeft, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Paragraphs', value: stats.paragraphs, icon: Pilcrow, color: 'text-orange-600 bg-orange-50' },
    { label: 'Spaces', value: stats.spaces, icon: Space, color: 'text-rose-600 bg-rose-50' },
  ]

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-900 font-medium">Word Counter</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Word Counter</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Analyze your text in real-time. Get instant statistics on word count, characters, sentences, and paragraphs.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {statItems.map((item) => (
            <Card key={item.label} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 leading-none">{item.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Text input */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <Textarea
              placeholder="Start typing or paste your text here..."
              className="min-h-[280px] text-base border-0 shadow-none focus-visible:ring-0 resize-y p-0"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Info section */}
        <div className="mt-10 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900">About Word Counter</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our word counter tool helps you analyze your text in real-time. Perfect for essays, articles, social media posts, and any text-based content where precision matters.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              'Ensure content meets length requirements',
              'Track writing progress for projects',
              'Optimize text for readability',
              'Assess document structure quickly',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

