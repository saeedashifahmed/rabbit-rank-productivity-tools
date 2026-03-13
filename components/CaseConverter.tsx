'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Type, ChevronRight, Copy, Check } from 'lucide-react'

export default function CaseConverter() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const convertCase = (type: string) => {
    switch (type) {
      case 'upper':
        setText(text.toUpperCase())
        break
      case 'lower':
        setText(text.toLowerCase())
        break
      case 'title':
        setText(
          text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
        )
        break
      case 'sentence':
        setText(
          text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        )
        break
      case 'camel':
        setText(
          text.toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
        )
        break
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const caseButtons = [
    { type: 'upper', label: 'UPPERCASE', description: 'ALL CAPS' },
    { type: 'lower', label: 'lowercase', description: 'all lowercase' },
    { type: 'title', label: 'Title Case', description: 'Capitalize Each Word' },
    { type: 'sentence', label: 'Sentence case', description: 'First letter capitalized' },
    { type: 'camel', label: 'camelCase', description: 'forDevelopers' },
  ]

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-900 font-medium">Case Converter</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Type className="h-5 w-5 text-purple-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Case Converter</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Transform your text between different cases instantly. Perfect for formatting titles, coding, and ensuring consistent capitalization.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        {/* Conversion buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {caseButtons.map((btn) => (
            <Button
              key={btn.type}
              variant="outline"
              onClick={() => convertCase(btn.type)}
              className="rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-colors"
              disabled={!text}
            >
              {btn.label}
            </Button>
          ))}
          {text && (
            <Button
              variant="ghost"
              onClick={copyToClipboard}
              className="ml-auto gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          )}
        </div>

        {/* Text input */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <Textarea
              placeholder="Enter your text here to convert..."
              className="min-h-[280px] text-base border-0 shadow-none focus-visible:ring-0 resize-y p-0"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Info section */}
        <div className="mt-10 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900">About Case Converter</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Whether you need uppercase for headlines, lowercase for consistency, or title case for proper formatting, our tool makes it simple and efficient.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              'Format titles and headings for articles',
              'Prepare text for coding (e.g., camelCase)',
              'Ensure consistent capitalization',
              'Adjust text case for style guidelines',
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

