'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const navItems = [
  { name: 'Word Counter', href: '/' },
  { name: 'Case Converter', href: '/case-converter' },
  { name: 'URL Trimmer', href: '/url-trimmer' },
  { name: 'Image Compressor', href: '/image-compressor' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="relative">
                <span className={`text-lg ${pathname === item.href ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>
                  {item.name}
                </span>
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"
                    layoutId="underline"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

