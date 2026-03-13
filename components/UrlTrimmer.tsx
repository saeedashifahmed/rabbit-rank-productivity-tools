'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { CSVLink } from 'react-csv'
import { LinkIcon, ChevronRight, Download, Scissors, CheckCircle, AlertCircle, Copy, Check, Trash2, Filter } from 'lucide-react'

export default function UrlTrimmer() {
  const [urls, setUrls] = useState('')
  const [results, setResults] = useState<{ original: string; trimmed: string }[]>([])
  const [copied, setCopied] = useState(false)
  const [showUnique, setShowUnique] = useState(false)

  const trimUrls = () => {
    const urlList = urls.split('\n').filter(url => url.trim())
    const processed = urlList.map(url => {
      try {
        const trimmed = new URL(url.trim()).hostname
        return { original: url.trim(), trimmed }
      } catch {
        return { original: url.trim(), trimmed: 'Invalid URL' }
      }
    })
    setResults(processed)
  }

  const displayResults = showUnique
    ? results.filter((item, index, self) =>
        item.trimmed !== 'Invalid URL' &&
        self.findIndex(t => t.trimmed === item.trimmed) === index
      )
    : results

  const validResults = results.filter(r => r.trimmed !== 'Invalid URL')
  const uniqueDomains = new Set(validResults.map(r => r.trimmed)).size
  const invalidCount = results.filter(r => r.trimmed === 'Invalid URL').length

  const copyAllDomains = () => {
    const domains = displayResults
      .filter(r => r.trimmed !== 'Invalid URL')
      .map(r => r.trimmed)
      .join('\n')
    navigator.clipboard.writeText(domains)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
              {urls.trim() && (
                <Button variant="ghost" size="sm" onClick={() => { setUrls(''); setResults([]); }} className="w-full mt-2 gap-1.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear All
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <Card className="border shadow-sm">
              <CardContent className="p-4 sm:p-6">
                {/* Stats bar */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg text-xs font-medium text-blue-700">
                    Total: {results.length}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg text-xs font-medium text-green-700">
                    Unique domains: {uniqueDomains}
                  </div>
                  {invalidCount > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-lg text-xs font-medium text-red-700">
                      Invalid: {invalidCount}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">
                    Results ({displayResults.length})
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={showUnique ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowUnique(!showUnique)}
                      className="gap-1.5 text-xs"
                    >
                      <Filter className="h-3 w-3" />
                      {showUnique ? 'Show All' : 'Unique Only'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyAllDomains} className="gap-1.5 text-xs">
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copied!' : 'Copy All'}
                    </Button>
                    <CSVLink
                      data={displayResults.map(item => [item.original, item.trimmed])}
                      headers={['Original URL', 'Root Domain']}
                      filename="trimmed_urls.csv"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-3.5 w-3.5" />
                        Export CSV
                      </Button>
                    </CSVLink>
                  </div>
                </div>
                <div className="rounded-xl border overflow-hidden">
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div>Original URL</div>
                    <div>Root Domain</div>
                  </div>
                  <div className="divide-y max-h-[400px] overflow-y-auto">
                    {displayResults.map((result, index) => (
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
            Streamline your workflow when dealing with large sets of URLs. Extract root domains from hundreds of URLs in seconds. Whether you&apos;re an SEO professional analyzing backlinks, a digital marketer auditing campaigns, or a developer cleaning data, this tool saves hours of manual work.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              'Process hundreds of URLs simultaneously',
              'Filter to show unique domains only',
              'Export results to CSV for analysis',
              'Copy all domains to clipboard at once',
              'Identify and count unique root domains',
              'Handle various URL formats and protocols',
              'Detect and flag invalid URLs',
              'Perfect for SEO backlink analysis',
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
              { q: 'How many URLs can I process at once?', a: 'There is no hard limit. The tool runs in your browser, so it can handle hundreds or even thousands of URLs efficiently.' },
              { q: 'What URL formats are supported?', a: 'Any valid URL with a protocol (http://, https://, ftp://) is supported. URLs without a protocol will show as invalid.' },
              { q: 'What does "Unique Only" do?', a: 'The "Unique Only" filter removes duplicate root domains from the results, showing each domain only once. This is useful for counting distinct domains in your URL list.' },
              { q: 'Can I export the results?', a: 'Yes! Export to CSV for spreadsheet analysis, or use "Copy All" to copy all root domains to your clipboard.' },
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

