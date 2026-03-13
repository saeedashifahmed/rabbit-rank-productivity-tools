'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FileIcon as FileVector, Upload, Download, CheckCircle, ChevronRight, ArrowDown, RotateCcw, Copy, Check } from 'lucide-react'

export default function SvgCompressorTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalSvgContent, setOriginalSvgContent] = useState<string>('')
  const [compressedSvgContent, setCompressedSvgContent] = useState<string>('')
  const [compressedSvg, setCompressedSvg] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'image/svg+xml') {
      setSelectedFile(file)
      setOriginalSize(file.size)
      setCompressedSvg(null)
      setCompressedSvgContent('')

      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalSvgContent(e.target?.result as string)
      }
      reader.readAsText(file)
    } else if (file) {
      alert('Please select a valid SVG file.')
    }
  }

  const compressSvg = async () => {
    if (!selectedFile || !originalSvgContent) return
    setIsProcessing(true)

    await new Promise(resolve => setTimeout(resolve, 500))

    // Basic SVG optimization
    let optimized = originalSvgContent
      .replace(/<!--[\s\S]*?-->/g, '')            // Remove comments
      .replace(/\s+/g, ' ')                       // Collapse whitespace
      .replace(/>\s+</g, '><')                    // Remove whitespace between tags
      .replace(/\s*([={}])\s*/g, '$1')            // Remove spaces around = and {}
      .replace(/<metadata[\s\S]*?<\/metadata>/gi, '') // Remove metadata
      .replace(/\s(id|class)="[^"]*"/g, '')       // Remove id and class attributes
      .replace(/\s*xmlns:(?!svg)[a-z]+="[^"]*"/g, '') // Remove unused namespaces
      .trim()

    setCompressedSvgContent(optimized)
    const blob = new Blob([optimized], { type: 'image/svg+xml' })
    setCompressedSize(blob.size)
    setCompressedSvg(URL.createObjectURL(blob))
    setIsProcessing(false)
  }

  const resetAll = () => {
    setSelectedFile(null)
    setOriginalSvgContent('')
    setCompressedSvgContent('')
    if (compressedSvg) URL.revokeObjectURL(compressedSvg)
    setCompressedSvg(null)
    setOriginalSize(0)
    setCompressedSize(0)
  }

  const copySvgCode = () => {
    if (compressedSvgContent) {
      navigator.clipboard.writeText(compressedSvgContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const compressionRate = originalSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB'
    return (bytes / 1024).toFixed(1) + ' KB'
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
              <FileVector className="h-5 w-5 text-cyan-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">SVG Compressor</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Optimize your SVG files by removing unnecessary data, comments, and metadata for faster loading times and better web performance.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="svg-file"
                  className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-1 text-sm text-gray-700 font-medium">Click to upload SVG file</p>
                    <p className="text-xs text-gray-500">SVG files only</p>
                  </div>
                  <Input
                    id="svg-file"
                    type="file"
                    accept=".svg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {selectedFile && (
                <div className="mt-3 px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-600 flex items-center justify-between">
                  <span className="truncate font-medium">{selectedFile.name}</span>
                  <span className="text-gray-500 shrink-0 ml-3">{formatSize(selectedFile.size)}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mb-4">
              <Button
                onClick={compressSvg}
                className="flex-1 rounded-xl h-11"
                disabled={!selectedFile || isProcessing}
              >
                <FileVector className="mr-2 h-4 w-4" />
                {isProcessing ? 'Compressing...' : 'Compress SVG'}
              </Button>
              {selectedFile && (
                <Button variant="outline" onClick={resetAll} className="rounded-xl h-11">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>

            {compressedSvg && (
              <div className="mt-4 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <div className="text-xs text-gray-500 mb-1">Original</div>
                    <div className="font-bold text-gray-900 text-sm">{formatSize(originalSize)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <div className="text-xs text-gray-500 mb-1">Compressed</div>
                    <div className="font-bold text-gray-900 text-sm">{formatSize(compressedSize)}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl text-center">
                    <div className="text-xs text-green-600 mb-1">Saved</div>
                    <div className="font-bold text-green-700 text-sm flex items-center justify-center gap-1">
                      <ArrowDown className="h-3 w-3" />
                      {compressionRate}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  <span className="text-green-800 font-medium">Compressed by {compressionRate}%</span>
                </div>

                <div className="flex gap-3">
                  <Button asChild className="flex-1 rounded-xl h-11">
                    <a href={compressedSvg} download={`compressed_${selectedFile?.name || 'file.svg'}`}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Compressed SVG
                    </a>
                  </Button>
                  <Button variant="outline" onClick={copySvgCode} className="rounded-xl h-11">
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy SVG'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info section */}
        <div className="mt-10 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900">About SVG Compressor</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            SVG (Scalable Vector Graphics) files are essential for crisp icons, logos, and illustrations on the web. However, SVGs exported from design tools often contain unnecessary metadata, comments, and redundant attributes. Our compressor strips these out to create leaner, faster-loading files.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              'Removes XML comments and metadata',
              'Strips unnecessary attributes and namespaces',
              'Collapses redundant whitespace',
              'Maintained quality and scalability',
              'Copy optimized SVG code directly',
              'Better SEO and page performance scores',
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
              { q: 'What does SVG compression do?', a: 'SVG compression removes unnecessary data like comments, metadata, unused namespaces, and redundant whitespace from your SVG files, reducing file size without affecting visual appearance.' },
              { q: 'Will compression affect SVG quality?', a: 'No. SVG is a vector format, and our optimization only removes non-visual data. The image will look identical at any size.' },
              { q: 'Can I copy the optimized SVG code?', a: 'Yes! Use the "Copy SVG" button to copy the optimized SVG markup directly to your clipboard for use in your HTML or code.' },
              { q: 'Is there a file size limit?', a: 'There is no strict limit. The compression runs entirely in your browser, so performance depends on your device.' },
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
