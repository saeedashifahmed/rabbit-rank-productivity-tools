'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Type, ChevronRight, Copy, Check, Trash2, Download } from 'lucide-react'

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
      case 'pascal':
        setText(
          text.toLowerCase()
            .replace(/(^|[^a-zA-Z0-9])(.)/g, (m, sep, chr) => chr.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, '')
        )
        break
      case 'snake':
        setText(
          text.replace(/([a-z])([A-Z])/g, '$1_$2')
            .replace(/[\s\-]+/g, '_')
            .toLowerCase()
        )
        break
      case 'kebab':
        setText(
          text.replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[\s_]+/g, '-')
            .toLowerCase()
        )
        break
      case 'constant':
        setText(
          text.replace(/([a-z])([A-Z])/g, '$1_$2')
            .replace(/[\s\-]+/g, '_')
            .toUpperCase()
        )
        break
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadAsText = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted-text.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const charCount = text.length

  const caseButtons = [
    { type: 'upper', label: 'UPPERCASE', description: 'ALL CAPS' },
    { type: 'lower', label: 'lowercase', description: 'all lowercase' },
    { type: 'title', label: 'Title Case', description: 'Capitalize Each Word' },
    { type: 'sentence', label: 'Sentence case', description: 'First letter capitalized' },
    { type: 'camel', label: 'camelCase', description: 'forDevelopers' },
    { type: 'pascal', label: 'PascalCase', description: 'ForClassNames' },
    { type: 'snake', label: 'snake_case', description: 'with_underscores' },
    { type: 'kebab', label: 'kebab-case', description: 'with-hyphens' },
    { type: 'constant', label: 'CONSTANT_CASE', description: 'FOR_CONSTANTS' },
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
        <div className="flex flex-wrap gap-2 mb-4">
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
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{charCount} character{charCount !== 1 ? 's' : ''}</span>
          </div>
          {text && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="gap-1.5 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadAsText} className="gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setText('')} className="gap-1.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
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
            Our case converter supports 9 different text transformations to cover all your formatting needs — from writing headlines to naming variables in code. Instantly convert between uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              'Format titles and headings for articles',
              'Convert to camelCase or PascalCase for coding',
              'Generate snake_case for database columns',
              'Create kebab-case for URL slugs',
              'Use CONSTANT_CASE for config variables',
              'Ensure consistent capitalization styles',
              'One-click copy or download as .txt',
              'Real-time word and character count',
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
              { q: 'What case types are supported?', a: 'We support 9 case types: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE.' },
              { q: 'What is camelCase used for?', a: 'camelCase is widely used in JavaScript and TypeScript for variable and function names (e.g., myVariableName, getUserData).' },
              { q: 'What is the difference between snake_case and kebab-case?', a: 'snake_case uses underscores (my_variable), common in Python and database fields. kebab-case uses hyphens (my-variable), common in URLs and CSS class names.' },
              { q: 'Can I download the converted text?', a: 'Yes! Use the Download button to save your converted text as a .txt file.' },
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

