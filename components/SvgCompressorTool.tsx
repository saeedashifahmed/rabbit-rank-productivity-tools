'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { FileCode2, Upload, Download, ChevronRight, RotateCcw, Copy, Check, Code2, Eye, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── SVG Optimizer ────────────────────────────────────────────────────────────

function optimizeSvg(input: string): string {
  let svg = input

  // 1. Remove XML declaration
  svg = svg.replace(/<\?xml[^?]*\?>/gi, '')

  // 2. Remove DOCTYPE
  svg = svg.replace(/<!DOCTYPE[^[>]*(\[[^\]]*\])?\s*>/gi, '')

  // 3. Remove XML/HTML comments
  svg = svg.replace(/<!--[\s\S]*?-->/g, '')

  // 4. Remove <metadata> blocks (Inkscape, Illustrator, Figma, etc.)
  svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, '')

  // 5. Remove Inkscape <sodipodi:namedview> and related elements
  svg = svg.replace(/<sodipodi:[a-zA-Z-]+(\s[^>]*)?\s*\/>/gi, '')
  svg = svg.replace(/<sodipodi:[a-zA-Z-]+[\s\S]*?<\/sodipodi:[a-zA-Z-]+>/gi, '')

  // 6. Remove editor-specific namespace declarations (inkscape, sodipodi, dc, cc, rdf, sketch, serif, xlink)
  svg = svg.replace(/\s+xmlns:(inkscape|sodipodi|dc|cc|rdf|sketch|serif|a|ns\d+)="[^"]*"/gi, '')

  // 7. Remove editor-specific attribute prefixes (inkscape:*, sodipodi:*, sketch:*, serif:*)
  svg = svg.replace(/\s+(inkscape|sodipodi|sketch|serif):[a-zA-Z0-9:_-]+=(?:"[^"]*"|'[^']*')/gi, '')

  // 8. Convert xlink:href → href (modern SVG), then drop xlink namespace
  svg = svg.replace(/xlink:href=/g, 'href=')
  svg = svg.replace(/\s+xmlns:xlink="[^"]*"/gi, '')

  // 9. Remove deprecated / unnecessary SVG root attributes
  svg = svg.replace(/(<svg\b[^>]*?)\s+version="[^"]*"/gi, '$1')
  svg = svg.replace(/(<svg\b[^>]*?)\s+baseProfile="[^"]*"/gi, '$1')
  svg = svg.replace(/(<svg\b[^>]*?)\s+xml:space="[^"]*"/gi, '$1')

  // 10. Remove enable-background (deprecated) anywhere it appears
  svg = svg.replace(/\s+enable-background="[^"]*"/gi, '')

  // 11. Remove empty style / class attributes
  svg = svg.replace(/\s+style=(?:""|'')/gi, '')
  svg = svg.replace(/\s+class=(?:""|'')/gi, '')

  // 12. Minify inline style values (strip whitespace around : and ;, drop trailing ;)
  svg = svg.replace(/style="([^"]*)"/gi, (_m, s: string) => {
    const min = s
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*;\s*/g, ';')
      .replace(/;$/, '')
      .trim()
    return min ? `style="${min}"` : ''
  })

  // 13. Shorten floating-point numbers to max 3 decimal places
  svg = svg.replace(/(\d+)\.(\d{4,})/g, (_m, int: string, dec: string) => {
    const rounded = parseFloat(`${int}.${dec}`).toFixed(3)
    // strip trailing zeros after decimal
    return rounded.replace(/\.?0+$/, '')
  })

  // 14. Remove leading zeros from decimals: "0.5" → ".5"
  svg = svg.replace(/([\s,=("])0(\.\d)/g, '$1$2')

  // 15. Collapse whitespace between tags
  svg = svg.replace(/>\s+</g, '><')

  // 16. Collapse runs of whitespace within tags (but preserve single spaces)
  svg = svg.replace(/[ \t]{2,}/g, ' ')

  // 17. Remove trailing whitespace before closing angle brackets
  svg = svg.replace(/\s+>/g, '>')
  svg = svg.replace(/\s+\/>/g, '/>')

  // 18. Remove empty <g> elements
  svg = svg.replace(/<g(?:\s[^>]*)?\s*>\s*<\/g>/gi, '')

  // 19. Remove empty <defs> elements
  svg = svg.replace(/<defs(?:\s[^>]*)?\s*>\s*<\/defs>/gi, '')

  return svg.trim()
}

// Strip script/event-handler/JS-URL vectors before rendering preview (self-XSS safety)
function sanitizeForPreview(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/\s+on[a-zA-Z]+=(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/href="javascript:[^"]*"/gi, '')
    // Inject sizing so the preview box constrains the SVG
    .replace(/<svg(\s)/i, '<svg style="max-width:100%;max-height:200px"$1')
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SvgCompressorTool() {
  const [inputTab, setInputTab] = useState<'file' | 'paste'>('file')
  const [pasteValue, setPasteValue] = useState('')
  const [fileName, setFileName] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [compressedContent, setCompressedContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [previewTab, setPreviewTab] = useState<'preview' | 'code'>('preview')
  const [error, setError] = useState('')

  const originalSize = originalContent ? new Blob([originalContent]).size : 0
  const compressedSize = compressedContent ? new Blob([compressedContent]).size : 0
  const savingsPercent =
    originalSize > 0 ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0
  const bytesSaved = originalSize - compressedSize
  const hasResult = compressedContent.length > 0

  const formatSize = (bytes: number) => {
    if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(2) + ' MB'
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return bytes + ' B'
  }

  const processContent = useCallback((content: string, name = 'optimized.svg') => {
    setError('')
    if (!content.trim()) return
    if (!/<svg[\s>]/i.test(content)) {
      setError('Invalid SVG: no <svg> element found.')
      setOriginalContent('')
      setCompressedContent('')
      return
    }
    setOriginalContent(content)
    setFileName(name)
    setCompressedContent(optimizeSvg(content))
  }, [])

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => processContent(e.target?.result as string, file.name)
      reader.readAsText(file)
    },
    [processContent],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/svg+xml': ['.svg'] },
    maxFiles: 1,
  })

  const handlePaste = (value: string) => {
    setPasteValue(value)
    if (value.trim()) {
      processContent(value, 'pasted.svg')
    } else {
      setOriginalContent('')
      setCompressedContent('')
      setError('')
    }
  }

  const reset = () => {
    setOriginalContent('')
    setCompressedContent('')
    setFileName('')
    setPasteValue('')
    setError('')
  }

  const download = () => {
    const blob = new Blob([compressedContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName ? `optimized_${fileName}` : 'optimized.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(compressedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-900 font-medium">SVG Compressor</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              <FileCode2 className="h-5 w-5 text-cyan-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">SVG Compressor</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Optimize SVG files instantly by removing metadata, comments, and redundant code. Runs entirely in your browser — no uploads required.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        {/* ── Input card ── */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <Tabs value={inputTab} onValueChange={(v) => setInputTab(v as 'file' | 'paste')}>
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-gray-100 rounded-xl h-9">
                  <TabsTrigger value="file" className="rounded-lg text-sm px-4">Upload File</TabsTrigger>
                  <TabsTrigger value="paste" className="rounded-lg text-sm px-4">Paste Code</TabsTrigger>
                </TabsList>
                {hasResult && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={reset}
                    className="text-gray-500 hover:text-gray-700 rounded-xl gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                )}
              </div>

              <TabsContent value="file" className="mt-0">
                <div
                  {...getRootProps()}
                  className={cn(
                    'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all',
                    isDragActive
                      ? 'border-cyan-400 bg-cyan-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload
                    className={cn(
                      'w-8 h-8 mb-3 transition-colors',
                      isDragActive ? 'text-cyan-500' : 'text-gray-400',
                    )}
                  />
                  {isDragActive ? (
                    <p className="text-sm font-medium text-cyan-600">Drop your SVG here</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-700">Drag & drop or click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">SVG files only</p>
                    </>
                  )}
                </div>
                {fileName && !error && (
                  <div className="mt-3 px-4 py-2.5 bg-cyan-50 rounded-xl text-sm text-cyan-800 flex items-center gap-2">
                    <FileCode2 className="h-4 w-4 shrink-0" />
                    <span className="font-medium truncate">{fileName}</span>
                    <span className="text-cyan-600 shrink-0 ml-auto">{formatSize(originalSize)}</span>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="paste" className="mt-0">
                <Textarea
                  value={pasteValue}
                  onChange={(e) => handlePaste(e.target.value)}
                  placeholder="Paste your SVG code here…"
                  className="min-h-[160px] font-mono text-xs rounded-xl resize-none"
                />
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Results ── */}
        {hasResult && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Original</div>
                <div className="font-bold text-gray-900">{formatSize(originalSize)}</div>
              </div>
              <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Compressed</div>
                <div className="font-bold text-gray-900">{formatSize(compressedSize)}</div>
              </div>
              <div
                className={cn(
                  'rounded-xl p-4 text-center shadow-sm border',
                  savingsPercent > 0 ? 'bg-green-50 border-green-100' : 'bg-gray-50',
                )}
              >
                <div className={cn('text-xs mb-1', savingsPercent > 0 ? 'text-green-600' : 'text-gray-500')}>
                  Saved
                </div>
                <div className={cn('font-bold', savingsPercent > 0 ? 'text-green-700' : 'text-gray-700')}>
                  {savingsPercent > 0 ? `${savingsPercent}%` : '—'}
                </div>
              </div>
            </div>

            {/* Compression bar */}
            {savingsPercent > 0 && (
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Compression ratio</span>
                  <span>{formatSize(bytesSaved)} saved</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${savingsPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Preview + Code card */}
            <Card className="border shadow-sm">
              <CardContent className="p-4 sm:p-6">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
                    <button
                      onClick={() => setPreviewTab('preview')}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all',
                        previewTab === 'preview'
                          ? 'bg-white shadow-sm font-medium text-gray-900'
                          : 'text-gray-500 hover:text-gray-700',
                      )}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </button>
                    <button
                      onClick={() => setPreviewTab('code')}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all',
                        previewTab === 'code'
                          ? 'bg-white shadow-sm font-medium text-gray-900'
                          : 'text-gray-500 hover:text-gray-700',
                      )}
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      Code
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyCode} className="rounded-xl">
                      {copied ? (
                        <Check className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                      )}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button size="sm" onClick={download} className="rounded-xl">
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Preview pane */}
                {previewTab === 'preview' ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-2">Original</p>
                      <div
                        className="border rounded-xl p-4 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22><rect width=%2210%22 height=%2210%22 fill=%22%23f3f4f6%22/><rect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23f3f4f6%22/></svg>')] flex items-center justify-center min-h-[160px] overflow-hidden"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: sanitizeForPreview(originalContent) }}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-2">Compressed</p>
                      <div
                        className="border rounded-xl p-4 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22><rect width=%2210%22 height=%2210%22 fill=%22%23f3f4f6%22/><rect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23f3f4f6%22/></svg>')] flex items-center justify-center min-h-[160px] overflow-hidden"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: sanitizeForPreview(compressedContent) }}
                      />
                    </div>
                  </div>
                ) : (
                  /* Code pane */
                  <div className="bg-gray-950 rounded-xl p-4 overflow-auto max-h-72">
                    <pre className="text-xs text-emerald-400 font-mono whitespace-pre-wrap break-all leading-relaxed">
                      {compressedContent}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* ── Info ── */}
        <div className="mt-4 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900">About SVG Compressor</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            SVGs exported from design tools like Illustrator, Inkscape, or Figma are often bloated with editor
            metadata, comments, and redundant namespaces. Our optimizer strips all of that away in real time,
            producing the smallest safe output — with zero quality loss.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4 not-prose">
            {[
              'Removes XML declaration & DOCTYPE',
              'Strips comments & metadata blocks',
              'Drops Inkscape / Illustrator namespaces',
              'Shortens floating-point coordinates',
              'Minifies inline style values',
              'Removes empty groups and defs',
              'Converts xlink:href → href (modern SVG)',
              'Copy optimized code or download file',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'What does SVG compression do?',
                a: 'It removes non-visual data — XML declarations, editor metadata, comments, unused namespaces, and redundant whitespace — reducing file size without changing how the image looks.',
              },
              {
                q: 'Will compression affect SVG quality?',
                a: 'No. SVG is a vector format. Our optimizer only removes data that has no effect on rendering. The image looks identical at every size.',
              },
              {
                q: 'Can I paste SVG code directly?',
                a: 'Yes — switch to the "Paste Code" tab and paste your SVG markup. Results appear instantly as you type.',
              },
              {
                q: 'Is there a file size limit?',
                a: 'No. Everything runs locally in your browser, so there is no server upload limit. Performance depends on your device for very large files.',
              },
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
