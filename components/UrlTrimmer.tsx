'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { CSVLink } from 'react-csv'
import { LinkIcon, ChevronRight, Download, Scissors, CheckCircle, AlertCircle } from 'lucide-react'

export default function UrlTrimmer() {
  const [urls, setUrls] = useState('')
  const [results, setResults] = useState<{ original: string; trimmed: string }[]>([])

  const trimUrls = () => {
    const urlList = urls.split('\n').filter(url => url.trim())
    const processed = urlList.map(url => {
      try {
        const trimmed = new URL(url.trim()).hostname
        return { original: url.trim(), trimmed }
      } catch (error) {
        return { original: url.trim(), trimmed: 'Invalid URL' }
      }
    })
    setResults(processed)
  }

  const urlCount = urls.split('\n').filter(url => url.trim()).length

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-900 font-medium">URL Trimmer</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <LinkIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Trim URL(s) to Root</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Extract root domains from multiple URLs at once. Perfect for SEO analysis, data cleaning, and competitor research.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        <div className="grid gap-6">
          {/* Input */}
          <Card className="border shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Paste URLs (one per line)</label>
                {urlCount > 0 && (
                  <span className="text-xs text-gray-500">{urlCount} URL{urlCount !== 1 ? 's' : ''}</span>
                )}
              </div>
              <Textarea
                placeholder={"https://example.com/page/article\nhttps://another-site.com/blog/post\nhttps://third-example.org/products/item"}
                className="min-h-[200px] text-sm font-mono mb-4"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
              />
              <Button onClick={trimUrls} className="w-full rounded-xl h-11" disabled={!urls.trim()}>
                <Scissors className="mr-2 h-4 w-4" />
                Trim URLs to Root Domain
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <Card className="border shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">
                    Results ({results.length})
                  </h2>
                  <CSVLink
                    data={results.map(item => [item.original, item.trimmed])}
                    headers={['Original URL', 'Root Domain']}
                    filename="trimmed_urls.csv"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-3.5 w-3.5" />
                      Export CSV
                    </Button>
                  </CSVLink>
                </div>
                <div className="rounded-xl border overflow-hidden">
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div>Original URL</div>
                    <div>Root Domain</div>
                  </div>
                  <div className="divide-y max-h-[400px] overflow-y-auto">
                    {results.map((result, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 p-3 text-sm hover:bg-gray-50 transition-colors">
                        <div className="break-all text-gray-600">{result.original}</div>
                        <div className="break-all flex items-center gap-1.5">
                          {result.trimmed === 'Invalid URL' ? (
                            <><AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" /><span className="text-red-600">{result.trimmed}</span></>
                          ) : (
                            <><CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" /><span className="font-medium text-gray-900">{result.trimmed}</span></>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info section */}
        <div className="mt-10 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900">About URL Trimmer</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Streamline your workflow when dealing with large sets of URLs. Whether you&apos;re an SEO professional, digital marketer, or web developer, this tool saves hours of manual work.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              'Process multiple URLs simultaneously',
              'Export results to CSV for analysis',
              'Handle various URL formats',
              'Identify unique root domains instantly',
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

