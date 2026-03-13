"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"

const tools = [
  { name: "Word Counter", href: "/word-counter" },
  { name: "Case Converter", href: "/case-converter" },
  { name: "URL Trimmer", href: "/trim-urls-to-root" },
  { name: "Image Compressor", href: "/image-compressor" },
  { name: "HEIC to JPG", href: "/heic-to-jpg" },
  { name: "SVG Compressor", href: "/svg-compressor" },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (isMenuOpen) setIsToolsOpen(false)
  }

  const isToolActive = tools.some((t) => pathname === t.href)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="https://rabbitrank.com/logo.svg"
              alt="Rabbit Rank"
              width={140}
              height={44}
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="https://rabbitrank.com/"
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-md transition-colors"
            >
              Home
            </Link>
            <div className="relative group">
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isToolActive ? "text-primary" : "text-gray-600 hover:text-primary"
                }`}
              >
                Tools
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[200px]">
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        pathname === tool.href
                          ? "text-primary bg-primary/5 font-medium"
                          : "text-gray-600 hover:text-primary hover:bg-gray-50"
                      }`}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="https://rabbitrank.com/blog/"
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-md transition-colors"
            >
              Blog
            </Link>
            <Link
              href="https://rabbitrank.com/contact/"
              className="ml-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[500px] border-t border-gray-100" : "max-h-0"
        }`}
      >
        <nav className="container mx-auto px-4 py-3 space-y-1">
          <Link
            href="https://rabbitrank.com/"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
          >
            Home
          </Link>
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isToolActive ? "text-primary bg-primary/5" : "text-gray-700 hover:text-primary hover:bg-gray-50"
            }`}
          >
            Tools
            <ChevronDown className={`h-4 w-4 transition-transform ${isToolsOpen ? "rotate-180" : ""}`} />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              isToolsOpen ? "max-h-[300px]" : "max-h-0"
            }`}
          >
            <div className="pl-4 space-y-1 py-1">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === tool.href
                      ? "text-primary bg-primary/5 font-medium"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="https://rabbitrank.com/blog/"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="https://rabbitrank.com/contact/"
            onClick={() => setIsMenuOpen(false)}
            className="block mx-3 mt-2 px-4 py-2.5 text-center text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  )
}

