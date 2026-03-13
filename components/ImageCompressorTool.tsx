'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Download, Upload, Image as ImageIcon, ChevronRight, ArrowDown, RotateCcw, Info } from 'lucide-react'

export default function ImageCompressorTool() {
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number | null>(null)
  const [compressedSize, setCompressedSize] = useState<number | null>(null)
  const [quality, setQuality] = useState(80)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null)
  const [compressedDimensions, setCompressedDimensions] = useState<{ width: number; height: number } | null>(null)

  const compressImage = useCallback((file: File, q: number) => {
    setOriginalSize(file.size)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new window.Image()
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height })
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const maxWidth = 1920
        const maxHeight = 1080
        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        canvas.width = width
        canvas.height = height
        setCompressedDimensions({ width, height })
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedImage((prev) => {
                if (prev) URL.revokeObjectURL(prev)
                return URL.createObjectURL(blob)
              })
              setCompressedSize(blob.size)
            }
          },
          'image/jpeg',
          q / 100
        )
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setOriginalFile(file)
      compressImage(file, quality)
    }
  }, [quality, compressImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  })

  const handleQualityChange = (value: number[]) => {
    const newQuality = value[0]
    setQuality(newQuality)
    if (originalFile) {
      compressImage(originalFile, newQuality)
    }
  }

  const resetAll = () => {
    setCompressedImage((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setOriginalSize(null)
    setCompressedSize(null)
    setOriginalFile(null)
    setFileName('')
    setOriginalDimensions(null)
    setCompressedDimensions(null)
    setQuality(80)
  }

  const savings = originalSize && compressedSize
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
            <span className="text-gray-900 font-medium">Image Compressor</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-orange-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Image Compressor</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Reduce image file sizes while maintaining quality. Supports JPEG, PNG, and GIF formats with adjustable compression quality.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              {isDragActive ? (
                <p className="text-primary font-medium">Drop the image here...</p>
              ) : (
                <>
                  <p className="text-gray-700 font-medium mb-1">Drag & drop an image here</p>
                  <p className="text-sm text-gray-500">or click to browse — JPEG, PNG, GIF supported</p>
                </>
              )}
            </div>

            {originalFile && (
              <div className="mt-4 px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-600 flex items-center justify-between">
                <span className="truncate font-medium">{fileName}</span>
                <span className="text-gray-500 shrink-0 ml-3">{formatSize(originalSize!)}</span>
              </div>
            )}

            {/* Quality Control */}
            {originalFile && (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Compression Quality</label>
                  <span className="text-sm font-bold text-primary">{quality}%</span>
                </div>
                <Slider
                  value={[quality]}
                  onValueChange={handleQualityChange}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Smaller file</span>
                  <span>Higher quality</span>
                </div>
              </div>
            )}

            {compressedImage && (
              <div className="mt-6 space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <div className="text-xs text-gray-500 mb-1">Original</div>
                    <div className="font-bold text-gray-900 text-sm">{formatSize(originalSize!)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <div className="text-xs text-gray-500 mb-1">Compressed</div>
                    <div className="font-bold text-gray-900 text-sm">{formatSize(compressedSize!)}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl text-center">
                    <div className="text-xs text-green-600 mb-1">Saved</div>
                    <div className="font-bold text-green-700 text-sm flex items-center justify-center gap-1">
                      <ArrowDown className="h-3 w-3" />
                      {savings}%
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl text-center">
                    <div className="text-xs text-blue-600 mb-1">Dimensions</div>
                    <div className="font-bold text-blue-700 text-sm">
                      {compressedDimensions ? `${compressedDimensions.width}×${compressedDimensions.height}` : '—'}
                    </div>
                  </div>
                </div>

                {/* Dimension comparison */}
                {originalDimensions && compressedDimensions && (originalDimensions.width !== compressedDimensions.width || originalDimensions.height !== compressedDimensions.height) && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 rounded-xl text-sm">
                    <Info className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-blue-700">
                      Resized from {originalDimensions.width}×{originalDimensions.height} to {compressedDimensions.width}×{compressedDimensions.height} (max 1920×1080)
                    </span>
                  </div>
                )}

                <img
                  src={compressedImage}
                  alt="Compressed preview"
                  className="max-w-full h-auto rounded-xl border"
                />
                <div className="flex gap-3">
                  <Button asChild className="flex-1 rounded-xl h-11">
                    <a href={compressedImage} download={`compressed_${fileName || 'image.jpg'}`}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Compressed
                    </a>
                  </Button>
                  <Button variant="outline" onClick={resetAll} className="rounded-xl h-11">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info section */}
        <div className="mt-10 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900">About Image Compressor</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our Image Compressor reduces file sizes while maintaining visual quality — perfect for web optimization, email attachments, or saving storage space. All processing happens locally in your browser; your images are never uploaded to any server.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              'Supports JPEG, PNG, and GIF formats',
              'Adjustable quality from 10% to 100%',
              'Auto-resizes to max 1920×1080 pixels',
              'Preserves original aspect ratio',
              'Process images entirely in your browser',
              'No file size limits or sign-ups required',
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
              { q: 'What image formats are supported?', a: 'Our compressor supports JPEG, PNG, and GIF image formats. The output is always a high-quality JPEG file.' },
              { q: 'Is there a file size limit?', a: 'There is no strict file size limit. However, very large images may take longer to process depending on your device.' },
              { q: 'Are my images uploaded to a server?', a: 'No. All compression happens locally in your browser using the HTML5 Canvas API. Your images never leave your device.' },
              { q: 'How does the quality slider work?', a: 'The quality slider controls JPEG compression level. Lower values produce smaller files with more compression artifacts, while higher values maintain better quality at larger file sizes.' },
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
