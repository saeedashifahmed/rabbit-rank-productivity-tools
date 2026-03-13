'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Type, LinkIcon, Image, ArrowRight, Zap, Shield, Sparkles, Repeat, Wifi, HeartHandshake, MousePointerClick, FileInput, FileImage, FileIcon as FileVector } from 'lucide-react'

export default function HomePage() {
  const ourToolsRef = useRef<HTMLDivElement>(null)

  const scrollToTools = () => {
    ourToolsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const tools = [
    {
      title: 'Word Counter',
      description: 'Count words, characters, sentences, and paragraphs in your text with real-time precision.',
      icon: FileText,
      href: '/word-counter',
      color: 'from-blue-500/10 to-blue-600/5',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Case Converter',
      description: 'Transform text between uppercase, lowercase, title case, sentence case, and camelCase.',
      icon: Type,
      href: '/case-converter',
      color: 'from-purple-500/10 to-purple-600/5',
      iconColor: 'text-purple-600',
    },
    {
      title: 'URL Trimmer',
      description: 'Extract root domains from multiple URLs at once — perfect for SEO and data analysis.',
      icon: LinkIcon,
      href: '/trim-urls-to-root',
      color: 'from-emerald-500/10 to-emerald-600/5',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Image Compressor',
      description: 'Reduce image file sizes while maintaining quality for faster web performance.',
      icon: Image,
      href: '/image-compressor',
      color: 'from-orange-500/10 to-orange-600/5',
      iconColor: 'text-orange-600',
    },
    {
      title: 'HEIC to JPG',
      description: 'Convert Apple HEIC images to widely-compatible JPG format instantly.',
      icon: FileImage,
      href: '/heic-to-jpg',
      color: 'from-rose-500/10 to-rose-600/5',
      iconColor: 'text-rose-600',
    },
    {
      title: 'SVG Compressor',
      description: 'Optimize SVG files for faster loading times and better web performance.',
      icon: FileVector,
      href: '/svg-compressor',
      color: 'from-cyan-500/10 to-cyan-600/5',
      iconColor: 'text-cyan-600',
    },
  ]

  const features = [
    { icon: Zap, title: "Lightning Fast", description: "Instant results with optimized processing. Handle large data in seconds." },
    { icon: Shield, title: "Secure & Private", description: "Everything runs locally in your browser. Your data never leaves your device." },
    { icon: Sparkles, title: "Easy to Use", description: "Clean, intuitive interfaces — no learning curve required." },
    { icon: Repeat, title: "Regular Updates", description: "Continuously improved based on user feedback and industry trends." },
    { icon: Wifi, title: "Works Offline", description: "Stay productive anywhere — our tools work without an internet connection." },
    { icon: HeartHandshake, title: "100% Free", description: "No sign-ups, no limits, no hidden fees. Professional tools for everyone." },
  ]

  const steps = [
    { icon: MousePointerClick, title: "Choose a Tool", description: "Browse our collection and pick the right tool for your task." },
    { icon: FileInput, title: "Input Your Data", description: "Enter text, upload images, or paste URLs — getting started is easy." },
    { icon: Zap, title: "Get Instant Results", description: "Receive accurate results immediately and export them as needed." },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-primary/5 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtNGgtNHYyaC00di0ySDJ2NGg0djRIMnY0aDR2LTRoNHY0aDR2LTRoNHYtNGgtNHYtNGg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Free Professional Productivity Tools
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-5">
              Work Smarter with
              <span className="text-primary"> Rabbit Rank </span>
              Tools
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              A suite of essential, browser-based tools designed for writers, developers, marketers, and SEO professionals. Fast, private, and completely free.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button onClick={scrollToTools} size="lg" className="font-semibold text-base px-8 h-12 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                Explore Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="font-semibold text-base px-8 h-12 rounded-xl" asChild>
                <Link href="https://rabbitrank.com/blog/">Read Our Blog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section ref={ourToolsRef} className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Our Professional Tools</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Everything you need to boost your productivity — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                  <tool.icon className={`h-6 w-6 ${tool.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {tool.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it now <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Why Choose Rabbit Rank Tools?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built for speed, privacy, and simplicity — here&apos;s why professionals trust our platform.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600">Three simple steps to boost your productivity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center md:right-auto md:left-1/2 md:ml-5 md:-top-1">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-primary/5 via-white to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of professionals who use Rabbit Rank Tools every day.
          </p>
          <Button
            size="lg"
            className="font-semibold text-base px-8 h-12 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            onClick={scrollToTools}
          >
            Try Our Tools — It&apos;s Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}

