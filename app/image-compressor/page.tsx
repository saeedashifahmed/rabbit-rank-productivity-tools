'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Upload, Image as ImageIcon, ChevronRight, ArrowDown } from 'lucide-react'

export default function ImageCompressor() {
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number | null>(null)
  const [compressedSize, setCompressedSize] = useState<number | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setOriginalSize(file.size)

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const maxWidth = 1920
        const maxHeight = 1080
        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedImage(URL.createObjectURL(blob))
              setCompressedSize(blob.size)
            }
          },
          'image/jpeg',
          0.8
        )
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  })

  const savings = originalSize && compressedSize
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0

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
            Reduce image file sizes while maintaining quality. Supports JPEG, PNG, and GIF formats.
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
                  <p className="text-sm text-gray-500">or click to browse your files</p>
                </>
              )}
            </div>

            {compressedImage && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-xs text-gray-500 mb-1">Original</div>
                    <div className="font-bold text-gray-900">{(originalSize! / 1024).toFixed(1)} KB</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-xs text-gray-500 mb-1">Compressed</div>
                    <div className="font-bold text-gray-900">{(compressedSize! / 1024).toFixed(1)} KB</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <div className="text-xs text-green-600 mb-1">Saved</div>
                    <div className="font-bold text-green-700 flex items-center justify-center gap-1">
                      <ArrowDown className="h-3.5 w-3.5" />
                      {savings}%
                    </div>
                  </div>
                </div>
                <img
                  src={compressedImage}
                  alt="Compressed preview"
                  className="max-w-full h-auto rounded-xl border"
                />
                <Button asChild className="w-full rounded-xl h-11">
                  <a href={compressedImage} download="compressed_image.jpg">
                    <Download className="mr-2 h-4 w-4" />
                    Download Compressed Image
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info section */}
        <div className="mt-10 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900">About Image Compressor</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our Image Compressor reduces file sizes while maintaining visual quality — perfect for web optimization, email attachments, or saving storage space.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              'Supports JPEG, PNG, and GIF formats',
              'Max resolution: 1920×1080 pixels',
              'Preserves original aspect ratio',
              'Process images entirely in your browser',
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

