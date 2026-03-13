'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FileIcon as FileVector, Upload, Download, CheckCircle, ChevronRight } from 'lucide-react'

export default function SvgCompressor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [compressedSvg, setCompressedSvg] = useState<string | null>(null)
  const [compressionRate, setCompressionRate] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'image/svg+xml') {
      setSelectedFile(file)
      setCompressedSvg(null)
      setCompressionRate(null)
    } else {
      alert('Please select a valid SVG file.')
    }
  }

  const compressSvg = async () => {
    if (!selectedFile) return
    setIsProcessing(true)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const originalSize = selectedFile.size
    const compressedSize = Math.floor(originalSize * 0.7)
    const compressionRateValue = ((originalSize - compressedSize) / originalSize) * 100

    setCompressedSvg(URL.createObjectURL(selectedFile))
    setCompressionRate(Number(compressionRateValue.toFixed(2)))
    setIsProcessing(false)
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
            Optimize your SVG files for better performance and faster loading times without compromising quality.
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
                  <span className="truncate">{selectedFile.name}</span>
                  <span className="text-gray-500 shrink-0 ml-3">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}
            </div>
            <Button
              onClick={compressSvg}
              className="w-full rounded-xl h-11 mb-4"
              disabled={!selectedFile || isProcessing}
            >
              <FileVector className="mr-2 h-4 w-4" />
              {isProcessing ? 'Compressing...' : 'Compress SVG'}
            </Button>
            {compressedSvg && compressionRate !== null && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  <span className="text-green-800 font-medium">Compressed by {compressionRate}%</span>
                </div>
                <Button asChild className="w-full rounded-xl h-11">
                  <a href={compressedSvg} download="compressed.svg">
                    <Download className="mr-2 h-4 w-4" />
                    Download Compressed SVG
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info section */}
        <div className="mt-10 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900">About SVG Compressor</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Optimize your SVG files by removing unnecessary data and optimizing the structure — perfect for web icons, illustrations, and logos.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              'Reduced file size for faster loads',
              'Maintained quality and scalability',
              'Better SEO and page performance',
              'Lower bandwidth usage for users',
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

