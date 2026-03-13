import Link from "next/link"
import Image from "next/image"
import { Facebook, Linkedin, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Image
              src="https://rabbitrank.com/logo.svg"
              alt="Rabbit Rank"
              width={130}
              height={42}
              className="brightness-0 invert"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional productivity tools to enhance your workflow. Simple, fast, and free solutions built for modern professionals.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://www.facebook.com/rabbitrank.llc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/RabbitRank"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/rabbitrank/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/rabbit.rank/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Tools</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/word-counter" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Word Counter
                </Link>
              </li>
              <li>
                <Link href="/case-converter" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Case Converter
                </Link>
              </li>
              <li>
                <Link href="/trim-urls-to-root" className="text-gray-400 hover:text-white text-sm transition-colors">
                  URL Trimmer
                </Link>
              </li>
              <li>
                <Link href="/image-compressor" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/heic-to-jpg" className="text-gray-400 hover:text-white text-sm transition-colors">
                  HEIC to JPG
                </Link>
              </li>
              <li>
                <Link href="/svg-compressor" className="text-gray-400 hover:text-white text-sm transition-colors">
                  SVG Compressor
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="https://rabbitrank.com/about-us/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="https://rabbitrank.com/contact/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="https://rabbitrank.com/blog/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="https://rabbitrank.com" className="text-gray-400 hover:text-white text-sm transition-colors">
                  SEO Services
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="https://rabbitrank.com/privacy-policy/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="https://rabbitrank.com/terms-of-use/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="https://rabbitrank.com/refund-policy/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Rabbit Rank LLC. All Rights Reserved. Made with ♥ in the USA.
            </p>
            <a
              href="https://rabbitbuilds.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors group"
            >
              <span>Crafted by</span>
              <img
                src="https://i.ibb.co/nMpz8mJd/rabbit-builds-favicon.png"
                alt="Rabbit Builds"
                width={18}
                height={18}
                className="rounded-sm opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <span className="font-medium group-hover:text-white transition-colors">Rabbit Builds</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

