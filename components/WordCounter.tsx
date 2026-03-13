'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FileText, ChevronRight, BookOpen, LetterText, AlignLeft, Pilcrow, Space, Clock, Hash, BarChart3, Trash2, Copy, Check } from 'lucide-react'

export default function WordCounter() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    spaces: 0,
    readingTime: '0 sec',
    avgWordLength: 0,
  })

  useEffect(() => {
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length
    const spaces = (text.match(/ /g) || []).length

    // Reading time (~200 words/min avg)
    const minutes = words / 200
    let readingTime = '0 sec'
    if (minutes >= 1) {
      readingTime = `${Math.ceil(minutes)} min`
    } else if (words > 0) {
      readingTime = `${Math.ceil(minutes * 60)} sec`
    }

    // Average word length
    const wordList = trimmed ? trimmed.split(/\s+/) : []
    const totalChars = wordList.reduce((sum, w) => sum + w.replace(/[^a-zA-Z0-9]/g, '').length, 0)
    const avgWordLength = words > 0 ? Math.round((totalChars / words) * 10) / 10 : 0

    setStats({ words, characters, charactersNoSpaces, sentences, paragraphs, spaces, readingTime, avgWordLength })
  }, [text])

  // Top keywords
  const topKeywords = useMemo(() => {
    if (!text.trim()) return []
    const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'because', 'if', 'that', 'this', 'these', 'those', 'it', 'its', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'about', 'up'])
    const freq: Record<string, number> = {}
    text.toLowerCase().split(/\s+/).forEach(word => {
      const clean = word.replace(/[^a-z0-9'-]/g, '')
      if (clean.length > 1 && !stopWords.has(clean)) {
        freq[clean] = (freq[clean] || 0) + 1
      }
    })
    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }, [text])

  const copyText = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statItems = [
    { label: 'Words', value: stats.words, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { label: 'Characters', value: stats.characters, icon: LetterText, color: 'text-purple-600 bg-purple-50' },
    { label: 'No Spaces', value: stats.charactersNoSpaces, icon: Hash, color: 'text-indigo-600 bg-indigo-50' },
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
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

        {/* Reading time & Avg word length bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Reading time: {stats.readingTime}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-xl">
            <BarChart3 className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-800">Avg word length: {stats.avgWordLength} chars</span>
          </div>
        </div>

        {/* Text input */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-end gap-2 mb-3">
              {text && (
                <>
                  <Button variant="ghost" size="sm" onClick={copyText} className="gap-1.5 text-xs">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setText('')} className="gap-1.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear
                  </Button>
                </>
              )}
            </div>
            <Textarea
              placeholder="Start typing or paste your text here..."
              className="min-h-[280px] text-base border-0 shadow-none focus-visible:ring-0 resize-y p-0"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Top Keywords */}
        {topKeywords.length > 0 && (
          <Card className="border shadow-sm mt-6">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Top Keywords
              </h2>
              <div className="flex flex-wrap gap-2">
                {topKeywords.map(([word, count]) => (
                  <div
                    key={word}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary rounded-full text-sm"
                  >
                    <span className="font-medium">{word}</span>
                    <span className="text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info section */}
        <div className="mt-10 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900">About Word Counter</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our word counter tool helps you analyze your text in real-time with comprehensive statistics. Perfect for essays, articles, blog posts, social media content, academic papers, and any text where precision matters.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              'Real-time word, character, and sentence count',
              'Characters counted with and without spaces',
              'Estimated reading time (200 words/min)',
              'Average word length analysis',
              'Top keyword frequency detection',
              'Paragraph and sentence counting',
              'One-click copy and clear functions',
              'Ensure content meets length requirements',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How are words counted?', a: 'Words are counted by splitting the text on whitespace characters (spaces, tabs, newlines). Consecutive whitespace is treated as a single separator.' },
              { q: 'What is the reading time based on?', a: 'Reading time is estimated at an average reading speed of 200 words per minute, which is the standard adult reading pace.' },
              { q: 'How are top keywords determined?', a: 'We analyze word frequency while filtering out common stop words (the, is, and, etc.) to surface meaningful keywords from your text.' },
              { q: 'Does this tool work offline?', a: 'Yes! All analysis happens in your browser. Once the page is loaded, you can use the word counter without an internet connection.' },
            ].map((faq) => (
              <div key={faq.q} className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 text-sm mb-1">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

