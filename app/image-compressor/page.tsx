import { Metadata } from 'next'
import ImageCompressorTool from '@/components/ImageCompressorTool'

export const metadata: Metadata = {
  title: 'Free Image Compressor — Reduce Image Size Online | Rabbit Rank Tools',
  description: 'Compress JPEG, PNG, and GIF images online for free. Reduce file size up to 80% with adjustable quality. No uploads — all processing happens in your browser.',
  openGraph: {
    title: 'Free Image Compressor — Reduce Image Size Online',
    description: 'Compress JPEG, PNG, and GIF images online for free. Reduce file size up to 80% with adjustable quality control.',
    url: 'https://tools.rabbitrank.com/image-compressor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Compressor — Reduce Image Size Online',
    description: 'Compress JPEG, PNG, and GIF images online for free. Reduce file size up to 80% with adjustable quality.',
  },
  alternates: {
    canonical: 'https://tools.rabbitrank.com/image-compressor',
  },
}

export default function ImageCompressorPage() {
  return <ImageCompressorTool />
}

