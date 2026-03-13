'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileImage, Upload, Download, ChevronRight } from 'lucide-react'

export default function HeicToJpgConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setConvertedImage(null)
    }
  }

  const convertToJpg = async () => {
    if (!selectedFile) return
    setIsProcessing(true)

    await new Promise(resolve => setTimeout(resolve, 1000))
    setConvertedImage(URL.createObjectURL(selectedFile))
    setIsProcessing(false)
  }

  const handleButtonClick = () => {
    document.getElementById('fileInput')?.click()
  }

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
            Convert HEIC images from Apple devices to widely-compatible JPG format instantly.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-6">
              <input
                type="file"
                accept=".heic"
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
                <p className="text-xs text-gray-500">HEIC files only</p>
              </label>
              {selectedFile && (
                <div className="mt-3 px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-600 flex items-center justify-between">
                  <span className="truncate">{selectedFile.name}</span>
                  <span className="text-gray-500 shrink-0 ml-3">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}
            </div>
            <Button
              onClick={convertToJpg}
              className="w-full rounded-xl h-11 mb-4"
              disabled={!selectedFile || isProcessing}
            >
              <FileImage className="mr-2 h-4 w-4" />
              {isProcessing ? 'Converting...' : 'Convert to JPG'}
            </Button>
            {convertedImage && (
              <div className="mt-4 space-y-4">
                <img
                  src={convertedImage}
                  alt="Converted JPG"
                  className="max-w-full h-auto rounded-xl border"
                />
                <Button asChild className="w-full rounded-xl h-11">
                  <a href={convertedImage} download="converted_image.jpg">
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
            HEIC is Apple&apos;s image format offering better compression than JPG but with limited compatibility. Convert to JPG for universal support across all devices and platforms.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
            {[
              'Share iOS photos with non-Apple users',
              'Upload to sites that require JPG format',
              'Compatible with all devices and software',
              'Maintained image quality after conversion',
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

