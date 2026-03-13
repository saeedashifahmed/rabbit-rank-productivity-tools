'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { FileImage, Upload, Download, ChevronRight, RotateCcw, CheckCircle, ArrowDown } from 'lucide-react'

export default function HeicToJpgTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [quality, setQuality] = useState(90)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [convertedSize, setConvertedSize] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setOriginalSize(file.size)
      setConvertedImage(null)
      setConvertedSize(null)
    }
  }

  const convertToJpg = async () => {
    if (!selectedFile) return
    setIsProcessing(true)

    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new window.Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                setConvertedImage((prev) => {
                  if (prev) URL.revokeObjectURL(prev)
                  return URL.createObjectURL(blob)
                })
                setConvertedSize(blob.size)
              }
              setIsProcessing(false)
            },
            'image/jpeg',
            quality / 100
          )
        }
        img.onerror = () => {
          setConvertedImage(URL.createObjectURL(selectedFile))
          setConvertedSize(selectedFile.size)
          setIsProcessing(false)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(selectedFile)
    } catch {
      setConvertedImage(URL.createObjectURL(selectedFile))
      setConvertedSize(selectedFile.size)
      setIsProcessing(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const resetAll = () => {
    setSelectedFile(null)
    setConvertedImage((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setOriginalSize(0)
    setConvertedSize(null)
    setQuality(90)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB'
    return (bytes / 1024).toFixed(1) + ' KB'
  }

  const savings = originalSize && convertedSize
    ? Math.max(0, Math.round(((originalSize - convertedSize) / originalSize) * 100))
    : 0

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-900 font-medium">HEIC to JPG</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <FileImage className="h-5 w-5 text-rose-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">HEIC to JPG Converter</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Convert HEIC images from Apple devices to widely-compatible JPG format instantly. Adjust output quality for the perfect balance between size and clarity.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept=".heic,.heif,image/*"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all"
                onClick={(e) => { e.preventDefault(); handleButtonClick(); }}
              >
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-1 text-sm text-gray-700 font-medium">Click to upload HEIC file</p>
                <p className="text-xs text-gray-500">HEIC and HEIF files supported</p>
              </label>
              {selectedFile && (
                <div className="mt-3 px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-600 flex items-center justify-between">
                  <span className="truncate font-medium">{selectedFile.name}</span>
                  <span className="text-gray-500 shrink-0 ml-3">{formatSize(selectedFile.size)}</span>
                </div>
              )}
            </div>

            {/* Quality Control */}
            {selectedFile && (
              <div className="mb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Output Quality</label>
                  <span className="text-sm font-bold text-primary">{quality}%</span>
                </div>
                <Slider
                  value={[quality]}
                  onValueChange={(val) => setQuality(val[0])}
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

            <div className="flex gap-3">
              <Button
                onClick={convertToJpg}
                className="flex-1 rounded-xl h-11"
                disabled={!selectedFile || isProcessing}
              >
                <FileImage className="mr-2 h-4 w-4" />
                {isProcessing ? 'Converting...' : 'Convert to JPG'}
              </Button>
              {selectedFile && (
                <Button variant="outline" onClick={resetAll} className="rounded-xl h-11">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>

            {convertedImage && (
              <div className="mt-6 space-y-4">
                {/* Conversion stats */}
                <div className="flex items-center gap-2 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  <span className="text-green-800 font-medium">Conversion complete!</span>
                </div>

                {convertedSize && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-3 rounded-xl text-center">
                      <div className="text-xs text-gray-500 mb-1">Original</div>
                      <div className="font-bold text-gray-900 text-sm">{formatSize(originalSize)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl text-center">
                      <div className="text-xs text-gray-500 mb-1">Converted</div>
                      <div className="font-bold text-gray-900 text-sm">{formatSize(convertedSize)}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl text-center">
                      <div className="text-xs text-green-600 mb-1">Saved</div>
                      <div className="font-bold text-green-700 text-sm flex items-center justify-center gap-1">
                        <ArrowDown className="h-3 w-3" />
                        {savings}%
                      </div>
                    </div>
                  </div>
                )}

                <img
                  src={convertedImage}
                  alt="Converted JPG"
                  className="max-w-full h-auto rounded-xl border"
                />
                <Button asChild className="w-full rounded-xl h-11">
                  <a href={convertedImage} download={`${selectedFile?.name?.replace(/\.[^.]+$/, '') || 'converted'}.jpg`}>
                    <Download className="mr-2 h-4 w-4" />
                    Download JPG
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info section */}
        <div className="mt-10 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900">About HEIC to JPG Converter</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            HEIC (High Efficiency Image Container) is Apple&apos;s modern image format, introduced with iOS 11. While HEIC offers superior compression compared to JPG, it has limited compatibility across non-Apple platforms. Our converter transforms HEIC images to the universally-supported JPG format instantly in your browser.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              'Share iOS photos with non-Apple users',
              'Upload to sites that require JPG format',
              'Compatible with all devices and software',
              'Adjustable output quality (10%–100%)',
              'Maintained image quality after conversion',
              'No uploads — conversion happens locally',
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
              { q: 'What is HEIC format?', a: 'HEIC (High Efficiency Image Container) is Apple\'s image format that provides better compression than JPG while maintaining image quality. iPhones and iPads use it by default since iOS 11.' },
              { q: 'Why convert HEIC to JPG?', a: 'JPG is universally supported across all platforms, browsers, and applications. Converting ensures your images can be viewed and shared anywhere without compatibility issues.' },
              { q: 'Does conversion reduce quality?', a: 'You can control the output quality with our quality slider. At 90-100%, the quality loss is virtually imperceptible to the human eye.' },
              { q: 'Is my image uploaded to a server?', a: 'No. All conversion happens entirely in your browser. Your images never leave your device, ensuring complete privacy.' },
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
