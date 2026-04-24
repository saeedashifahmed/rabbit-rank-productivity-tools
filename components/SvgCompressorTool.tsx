'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  FileCode2, Upload, Download, ChevronRight, RotateCcw, Copy, Check,
  Code2, Eye, AlertCircle, Settings2, ChevronDown, ChevronUp,
  Palette, Hash, Layers, Zap, Shield, FileSearch, Minimize2,
  TrendingDown, Lock, Globe, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OptimizationOptions {
  removeComments: boolean
  removeMetadata: boolean
  removeEditorData: boolean
  optimizeColors: boolean
  removeDefaultValues: boolean
  removeDataAttributes: boolean
  removeUnusedIds: boolean
  optimizeNumbers: boolean
  optimizePaths: boolean
  optimizeTransforms: boolean
  cleanupStyles: boolean
}

interface OptimizationStep {
  label: string
  icon: React.ReactNode
  savedBytes: number
}

interface OptimizationResult {
  output: string
  steps: OptimizationStep[]
}

// ─── Optimization option definitions ─────────────────────────────────────────

const OPTION_DEFS: { key: keyof OptimizationOptions; label: string; description: string; icon: React.ReactNode }[] = [
  { key: 'removeComments',      label: 'Remove comments',         description: 'Strip <!-- --> comment blocks',                            icon: <FileSearch className="h-3.5 w-3.5" /> },
  { key: 'removeMetadata',      label: 'Remove metadata',         description: 'Drop <metadata>, <title>, <desc> elements',               icon: <Layers className="h-3.5 w-3.5" /> },
  { key: 'removeEditorData',    label: 'Remove editor data',      description: 'Strip Inkscape, Figma, Illustrator cruft',                 icon: <Shield className="h-3.5 w-3.5" /> },
  { key: 'optimizeColors',      label: 'Optimize colors',         description: 'Shorten hex values, convert rgb() to #hex',               icon: <Palette className="h-3.5 w-3.5" /> },
  { key: 'removeDefaultValues', label: 'Remove SVG defaults',     description: 'Drop attributes set to their inherited default values',    icon: <Minimize2 className="h-3.5 w-3.5" /> },
  { key: 'removeDataAttributes',label: 'Remove data-* attributes',description: 'Eliminate data-* attributes added by editors',             icon: <FileSearch className="h-3.5 w-3.5" /> },
  { key: 'removeUnusedIds',     label: 'Remove unused IDs',       description: 'Drop id="" values not referenced elsewhere in the SVG',   icon: <Hash className="h-3.5 w-3.5" /> },
  { key: 'optimizeNumbers',     label: 'Optimize numbers',        description: 'Reduce decimal precision and strip leading zeros',         icon: <Hash className="h-3.5 w-3.5" /> },
  { key: 'optimizePaths',       label: 'Optimize paths',          description: 'Minify <path d=""> data and <polygon> points',            icon: <Zap className="h-3.5 w-3.5" /> },
  { key: 'optimizeTransforms',  label: 'Optimize transforms',     description: 'Remove identity transforms like translate(0,0)',           icon: <Zap className="h-3.5 w-3.5" /> },
  { key: 'cleanupStyles',       label: 'Minify styles',           description: 'Compress <style> blocks and inline style="" attributes',   icon: <Layers className="h-3.5 w-3.5" /> },
]

const DEFAULT_OPTIONS: OptimizationOptions = {
  removeComments:       true,
  removeMetadata:       true,
  removeEditorData:     true,
  optimizeColors:       true,
  removeDefaultValues:  true,
  removeDataAttributes: true,
  removeUnusedIds:      true,
  optimizeNumbers:      true,
  optimizePaths:        true,
  optimizeTransforms:   true,
  cleanupStyles:        true,
}

// ─── Color utilities ──────────────────────────────────────────────────────────

const NAMED_TO_HEX: Record<string, string> = {
  aliceblue:'#f0f8ff',antiquewhite:'#faebd7',aqua:'#0ff',aquamarine:'#7fffd4',azure:'#f0ffff',
  beige:'#f5f5dc',bisque:'#ffe4c4',black:'#000',blanchedalmond:'#ffebcd',blue:'#00f',
  blueviolet:'#8a2be2',brown:'#a52a2a',burlywood:'#deb887',cadetblue:'#5f9ea0',
  chartreuse:'#7fff00',chocolate:'#d2691e',coral:'#ff7f50',cornflowerblue:'#6495ed',
  cornsilk:'#fff8dc',crimson:'#dc143c',cyan:'#0ff',darkblue:'#00008b',darkcyan:'#008b8b',
  darkgoldenrod:'#b8860b',darkgray:'#a9a9a9',darkgreen:'#006400',darkgrey:'#a9a9a9',
  darkkhaki:'#bdb76b',darkmagenta:'#8b008b',darkolivegreen:'#556b2f',darkorange:'#ff8c00',
  darkorchid:'#9932cc',darkred:'#8b0000',darksalmon:'#e9967a',darkseagreen:'#8fbc8f',
  darkslateblue:'#483d8b',darkslategray:'#2f4f4f',darkslategrey:'#2f4f4f',
  darkturquoise:'#00ced1',darkviolet:'#9400d3',deeppink:'#ff1493',deepskyblue:'#00bfff',
  dimgray:'#696969',dimgrey:'#696969',dodgerblue:'#1e90ff',firebrick:'#b22222',
  floralwhite:'#fffaf0',forestgreen:'#228b22',fuchsia:'#f0f',gainsboro:'#dcdcdc',
  ghostwhite:'#f8f8ff',gold:'#ffd700',goldenrod:'#daa520',gray:'#808080',green:'#008000',
  greenyellow:'#adff2f',grey:'#808080',honeydew:'#f0fff0',hotpink:'#ff69b4',
  indianred:'#cd5c5c',indigo:'#4b0082',ivory:'#fffff0',khaki:'#f0e68c',lavender:'#e6e6fa',
  lavenderblush:'#fff0f5',lawngreen:'#7cfc00',lemonchiffon:'#fffacd',lightblue:'#add8e6',
  lightcoral:'#f08080',lightcyan:'#e0ffff',lightgoldenrodyellow:'#fafad2',lightgray:'#d3d3d3',
  lightgreen:'#90ee90',lightgrey:'#d3d3d3',lightpink:'#ffb6c1',lightsalmon:'#ffa07a',
  lightseagreen:'#20b2aa',lightskyblue:'#87cefa',lightslategray:'#789',lightslategrey:'#789',
  lightsteelblue:'#b0c4de',lightyellow:'#ffffe0',lime:'#0f0',limegreen:'#32cd32',
  linen:'#faf0e6',magenta:'#f0f',maroon:'#800000',mediumaquamarine:'#66cdaa',
  mediumblue:'#0000cd',mediumorchid:'#ba55d3',mediumpurple:'#9370db',mediumseagreen:'#3cb371',
  mediumslateblue:'#7b68ee',mediumspringgreen:'#00fa9a',mediumturquoise:'#48d1cc',
  mediumvioletred:'#c71585',midnightblue:'#191970',mintcream:'#f5fffa',mistyrose:'#ffe4e1',
  moccasin:'#ffe4b5',navajowhite:'#ffdead',navy:'#000080',oldlace:'#fdf5e6',olive:'#808000',
  olivedrab:'#6b8e23',orange:'#ffa500',orangered:'#ff4500',orchid:'#da70d6',
  palegoldenrod:'#eee8aa',palegreen:'#98fb98',paleturquoise:'#afeeee',palevioletred:'#db7093',
  papayawhip:'#ffefd5',peachpuff:'#ffdab9',peru:'#cd853f',pink:'#ffc0cb',plum:'#dda0dd',
  powderblue:'#b0e0e6',purple:'#800080',rebeccapurple:'#639',red:'#f00',rosybrown:'#bc8f8f',
  royalblue:'#4169e1',saddlebrown:'#8b4513',salmon:'#fa8072',sandybrown:'#f4a460',
  seagreen:'#2e8b57',seashell:'#fff5ee',sienna:'#a0522d',silver:'#c0c0c0',skyblue:'#87ceeb',
  slateblue:'#6a5acd',slategray:'#708090',slategrey:'#708090',snow:'#fffafa',
  springgreen:'#00ff7f',steelblue:'#4682b4',tan:'#d2b48c',teal:'#008080',thistle:'#d8bfd8',
  tomato:'#ff6347',turquoise:'#40e0d0',violet:'#ee82ee',wheat:'#f5deb3',white:'#fff',
  whitesmoke:'#f5f5f5',yellow:'#ff0',yellowgreen:'#9acd32',
}

function hexToShort(hex: string): string {
  const h = hex.toLowerCase()
  if (/^#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3$/.test(h)) return `#${h[1]}${h[3]}${h[5]}`
  return h
}

function shortenColor(color: string): string {
  const c = color.trim()
  const cl = c.toLowerCase()
  if (NAMED_TO_HEX[cl]) return NAMED_TO_HEX[cl]
  const rgb = cl.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/)
  if (rgb) return hexToShort(`#${(+rgb[1]).toString(16).padStart(2,'0')}${(+rgb[2]).toString(16).padStart(2,'0')}${(+rgb[3]).toString(16).padStart(2,'0')}`)
  const rgba = cl.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/)
  if (rgba) {
    if (parseFloat(rgba[4]) === 0) return 'transparent'
    if (parseFloat(rgba[4]) === 1) return hexToShort(`#${(+rgba[1]).toString(16).padStart(2,'0')}${(+rgba[2]).toString(16).padStart(2,'0')}${(+rgba[3]).toString(16).padStart(2,'0')}`)
  }
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return hexToShort(cl)
  if (/^#[0-9a-fA-F]{3}$/.test(c)) return cl
  return c
}

function applyColorOptimization(svg: string): string {
  const COLOR_ATTRS = /\b(fill|stroke|color|stop-color|flood-color|lighting-color|background-color)="([^"]+)"/gi
  svg = svg.replace(COLOR_ATTRS, (_, attr: string, val: string) => `${attr}="${shortenColor(val)}"`)
  svg = svg.replace(/style="([^"]*)"/gi, (_, s: string) =>
    `style="${s.replace(/(fill|stroke|color|stop-color):\s*([^;}"]+)/gi, (m: string, p: string, v: string) => `${p}:${shortenColor(v.trim())}`)}"`)
  svg = svg.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (_, attrs: string, css: string) => {
    const optimized = css.replace(/(fill|stroke|color|stop-color|background|background-color)\s*:\s*([^;{}]+)/gi,
      (m: string, prop: string, val: string) => `${prop}:${shortenColor(val.trim())}`)
      .replace(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, (m: string) => hexToShort(m))
    return `<style${attrs}>${optimized}</style>`
  })
  return svg
}

// ─── Number utilities ─────────────────────────────────────────────────────────

function fmtNum(n: string): string {
  const f = parseFloat(n)
  if (isNaN(f)) return n
  if (f === 0) return '0'
  const s = parseFloat(f.toFixed(3)).toString()
  return s.replace(/^(-?)0\./, '$1.')
}

// ─── Path data optimization ───────────────────────────────────────────────────

function optimizePathData(d: string): string {
  let r = d.trim()
  // Shorten numbers
  r = r.replace(/-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g, fmtNum)
  // Remove space after command letter
  r = r.replace(/([MmLlHhVvCcSsQqTtAaZz])\s+/g, '$1')
  // Remove space before command letter
  r = r.replace(/\s+([MmLlHhVvCcSsQqTtAaZz])/g, '$1')
  // l0,N → vN  and  lN,0 → hN  (relative only, safe)
  r = r.replace(/l([+-]?\.?\d+)[, ]0(?![.\d])/g, 'h$1')
  r = r.replace(/l0[, ]([+-]?\.?\d+)/g, 'v$1')
  // Collapse multi-space
  r = r.replace(/\s{2,}/g, ' ').trim()
  return r
}

// ─── Transform optimization ───────────────────────────────────────────────────

function optimizeTransformAttr(svg: string): string {
  // Remove identity transforms
  svg = svg.replace(/\s+transform="translate\(\s*0\s*(?:,\s*0\s*)?\)"/gi, '')
  svg = svg.replace(/\s+transform="rotate\(\s*0[^"]*\)"/gi, '')
  svg = svg.replace(/\s+transform="scale\(\s*1\s*(?:,\s*1\s*)?\)"/gi, '')
  svg = svg.replace(/\s+transform="matrix\(\s*1\s*,?\s*0\s*,?\s*0\s*,?\s*1\s*,?\s*0\s*,?\s*0\s*\)"/gi, '')
  svg = svg.replace(/\s+transform="skewX\(\s*0\s*\)"/gi, '')
  svg = svg.replace(/\s+transform="skewY\(\s*0\s*\)"/gi, '')
  // Simplify translate(x,0) → translate(x)
  svg = svg.replace(/transform="translate\(([^,)]+),\s*0\s*\)"/gi, 'transform="translate($1)"')
  // Optimize numbers in remaining transforms
  svg = svg.replace(/transform="([^"]*)"/gi, (_, t: string) =>
    `transform="${t.replace(/-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g, fmtNum)}"`)
  return svg
}

// ─── Style block minifier ─────────────────────────────────────────────────────

function minifyStyleBlock(css: string): string {
  const CSS_DEFAULTS: Record<string, string> = {
    opacity: '1', 'fill-opacity': '1', 'stroke-opacity': '1',
    display: 'inline', visibility: 'visible', 'stroke-dasharray': 'none',
  }
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*\{\s*/g, '{')
    .replace(/\s*\}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/;}/g, '}')
    .replace(/\s+/g, ' ')
    .replace(/([^}]);}/g, '$1}')
    .replace(/([a-z-]+):([^;{}]+)/g, (m: string, prop: string, val: string) =>
      CSS_DEFAULTS[prop.trim()] === val.trim() ? '' : m)
    .replace(/;;+/g, ';')
    .trim()
}

// ─── Main SVG optimization engine ────────────────────────────────────────────

function optimizeSvg(input: string, opts: OptimizationOptions): OptimizationResult {
  let svg = input
  const steps: OptimizationStep[] = []

  function track(label: string, icon: React.ReactNode, before: string, after: string) {
    const saved = new Blob([before]).size - new Blob([after]).size
    if (saved > 0) steps.push({ label, icon, savedBytes: saved })
  }

  // ① XML preamble (always)
  {
    const b = svg
    svg = svg.replace(/<\?xml[^?]*\?>/gi, '').replace(/<!DOCTYPE[^[>]*(?:\[[^\]]*\])?\s*>/gi, '')
    track('XML declaration & DOCTYPE', <FileSearch className="h-3 w-3" />, b, svg)
  }

  // ② Comments
  if (opts.removeComments) {
    const b = svg
    svg = svg.replace(/<!--(?!>|->)[\s\S]*?-->/g, '')
    track('Comments', <FileSearch className="h-3 w-3" />, b, svg)
  }

  // ③ Metadata elements
  if (opts.removeMetadata) {
    const b = svg
    svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
    svg = svg.replace(/<title>[\s\S]*?<\/title>/gi, '')
    svg = svg.replace(/<desc>[\s\S]*?<\/desc>/gi, '')
    track('Metadata, title & desc', <Layers className="h-3 w-3" />, b, svg)
  }

  // ④ Editor-specific junk
  if (opts.removeEditorData) {
    const b = svg
    // Inkscape namedview + sodipodi elements
    svg = svg.replace(/<sodipodi:[a-zA-Z-]+(?:\s[^>]*)?\s*\/>/gi, '')
    svg = svg.replace(/<sodipodi:[a-zA-Z-]+[\s\S]*?<\/sodipodi:[a-zA-Z-]+>/gi, '')
    // Adobe Illustrator
    svg = svg.replace(/<ai:[a-zA-Z-]+[\s\S]*?<\/ai:[a-zA-Z-]+>/gi, '')
    svg = svg.replace(/<ai:[a-zA-Z-]+(?:\s[^>]*)?\s*\/>/gi, '')
    // Editor namespace declarations
    svg = svg.replace(/\s+xmlns:(?:inkscape|sodipodi|dc|cc|rdf|sketch|serif|ai|figma|ns\d+|xlink)="[^"]*"/gi, '')
    // Editor-prefixed attributes
    svg = svg.replace(/\s+(?:inkscape|sodipodi|sketch|serif|ai):[a-zA-Z0-9:_-]+=(?:"[^"]*"|'[^']*')/gi, '')
    // xlink:href → href (modern SVG 2)
    svg = svg.replace(/xlink:href=/g, 'href=')
    // Deprecated SVG root attributes
    svg = svg.replace(/(<svg\b[^>]*?)\s+version="[^"]*"/gi, '$1')
    svg = svg.replace(/(<svg\b[^>]*?)\s+baseProfile="[^"]*"/gi, '$1')
    svg = svg.replace(/(<svg\b[^>]*?)\s+xml:space="[^"]*"/gi, '$1')
    // Deprecated presentation attributes
    svg = svg.replace(/\s+enable-background="[^"]*"/gi, '')
    track('Editor data & namespaces', <Shield className="h-3 w-3" />, b, svg)
  }

  // ⑤ data-* attributes
  if (opts.removeDataAttributes) {
    const b = svg
    svg = svg.replace(/\s+data-[a-zA-Z0-9_-]+=(?:"[^"]*"|'[^']*')/gi, '')
    track('data-* attributes', <FileSearch className="h-3 w-3" />, b, svg)
  }

  // ⑥ SVG default attribute values
  if (opts.removeDefaultValues) {
    const b = svg
    const SVG_DEFAULTS = [
      ['opacity', '1'],
      ['fill-opacity', '1'],
      ['stroke-opacity', '1'],
      ['display', 'inline'],
      ['visibility', 'visible'],
      ['stroke-dasharray', 'none'],
    ]
    for (const [attr, val] of SVG_DEFAULTS) {
      svg = svg.replace(new RegExp(`\\s+${attr}="${val}"`, 'g'), '')
    }
    // Remove empty style/class attributes
    svg = svg.replace(/\s+(?:style|class)=(?:""|'')/gi, '')
    // Remove empty attributes
    svg = svg.replace(/\s+[a-zA-Z:_-]+=(?:""|'')/g, '')
    track('Default attribute values', <Minimize2 className="h-3 w-3" />, b, svg)
  }

  // ⑦ Color optimization
  if (opts.optimizeColors) {
    const b = svg
    svg = applyColorOptimization(svg)
    track('Color values', <Palette className="h-3 w-3" />, b, svg)
  }

  // ⑧ Style cleanup
  if (opts.cleanupStyles) {
    const b = svg
    // Minify inline style attributes
    svg = svg.replace(/style="([^"]*)"/gi, (_, s: string) => {
      const props = s.split(';').filter(Boolean)
      const CSS_DEFAULTS: Record<string, string> = {
        opacity: '1', 'fill-opacity': '1', 'stroke-opacity': '1',
        display: 'inline', visibility: 'visible',
      }
      const kept = props.filter(p => {
        const [k, v] = p.split(':').map((x: string) => x.trim())
        return k && !(CSS_DEFAULTS[k] === v)
      }).map((p: string) =>
        p.replace(/\s*:\s*/g, ':').replace(/\s*;\s*/g, ';').trim()
      ).join(';').replace(/;$/, '')
      return kept ? `style="${kept}"` : ''
    })
    // Minify <style> blocks
    svg = svg.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (_, attrs: string, css: string) =>
      `<style${attrs}>${minifyStyleBlock(css)}</style>`)
    track('Style minification', <Layers className="h-3 w-3" />, b, svg)
  }

  // ⑨ Number precision
  if (opts.optimizeNumbers) {
    const b = svg
    // Shorten numbers in most attribute values (skip path d and transform — handled separately)
    svg = svg.replace(/="([^"]*?)"/g, (m: string, val: string) => {
      if (/^(?:d|transform|points)=/.test(m)) return m
      const optimized = val.replace(/-?(?:\d+\.?\d{4,}|\.\d{4,})(?:[eE][+-]?\d+)?/g, fmtNum)
      return `="${optimized}"`
    })
    track('Number precision', <Hash className="h-3 w-3" />, b, svg)
  }

  // ⑩ Path data
  if (opts.optimizePaths) {
    const b = svg
    svg = svg.replace(/\bd="([^"]*)"/gi, (_, d: string) => `d="${optimizePathData(d)}"`)
    svg = svg.replace(/\bpoints="([^"]*)"/gi, (_, pts: string) => {
      const opt = pts.replace(/-?(?:\d+\.?\d*|\.\d+)/g, fmtNum).trim()
      return `points="${opt}"`
    })
    track('Path & points data', <Zap className="h-3 w-3" />, b, svg)
  }

  // ⑪ Transforms
  if (opts.optimizeTransforms) {
    const b = svg
    svg = optimizeTransformAttr(svg)
    track('Transform optimization', <Zap className="h-3 w-3" />, b, svg)
  }

  // ⑫ Whitespace collapse
  {
    const b = svg
    svg = svg.replace(/>\s+</g, '><')
    svg = svg.replace(/[ \t]{2,}/g, ' ')
    svg = svg.replace(/\s+\/>/g, '/>')
    svg = svg.replace(/\s+>/g, '>')
    track('Whitespace', <Minimize2 className="h-3 w-3" />, b, svg)
  }

  // ⑬ Unused IDs (safe regex approach — only removes IDs not referenced via url(#) or href="#")
  if (opts.removeUnusedIds) {
    const b = svg
    const allIds: string[] = []
    const idRx = /\bid="([^"]+)"/g
    let m: RegExpExecArray | null
    while ((m = idRx.exec(svg)) !== null) allIds.push(m[1])

    const referenced = new Set<string>()
    const refRxs = [/url\(#([^)]+)\)/g, /href="#([^"]+)"/g, /begin="([^"]+)"/g]
    for (const rx of refRxs) {
      let rm: RegExpExecArray | null
      while ((rm = rx.exec(svg)) !== null) referenced.add(rm[1])
    }

    for (const id of allIds) {
      if (!referenced.has(id)) {
        svg = svg.replace(new RegExp(`\\s+id="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'), '')
      }
    }
    track('Unused IDs', <Hash className="h-3 w-3" />, b, svg)
  }

  // ⑭ Remove empty structural elements (3 passes to catch nesting)
  {
    const b = svg
    for (let i = 0; i < 3; i++) {
      svg = svg.replace(/<g(?:\s[^>]*)?\s*><\/g>/gi, '')
      svg = svg.replace(/<defs(?:\s[^>]*)?\s*><\/defs>/gi, '')
      svg = svg.replace(/<symbol(?:\s[^>]*)?\s*><\/symbol>/gi, '')
      svg = svg.replace(/<clipPath(?:\s[^>]*)?\s*><\/clipPath>/gi, '')
      svg = svg.replace(/<mask(?:\s[^>]*)?\s*><\/mask>/gi, '')
    }
    track('Empty elements', <Layers className="h-3 w-3" />, b, svg)
  }

  return { output: svg.trim(), steps }
}

// ─── Preview sanitizer ────────────────────────────────────────────────────────

function sanitizeForPreview(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/\s+on[a-zA-Z]+=(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/href="javascript:[^"]*"/gi, '')
    .replace(/<svg(\s)/i, '<svg style="max-width:100%;max-height:220px;width:100%;height:auto"$1')
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(2) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return bytes + ' B'
}

// ─── Component ────────────────────────────────────────────────────────────────

const CHECKERBOARD =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23e5e7eb'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23e5e7eb'/%3E%3Crect x='10' width='10' height='10' fill='%23f9fafb'/%3E%3Crect y='10' width='10' height='10' fill='%23f9fafb'/%3E%3C/svg%3E"

export default function SvgCompressorTool() {
  const [inputTab, setInputTab] = useState<'file' | 'paste'>('file')
  const [pasteValue, setPasteValue] = useState('')
  const [fileName, setFileName] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [previewTab, setPreviewTab] = useState<'original' | 'compressed' | 'code'>('compressed')
  const [error, setError] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [opts, setOpts] = useState<OptimizationOptions>(DEFAULT_OPTIONS)

  const compressedContent = result?.output ?? ''
  const originalSize = originalContent ? new Blob([originalContent]).size : 0
  const compressedSize = compressedContent ? new Blob([compressedContent]).size : 0
  const savingsPercent = originalSize > 0 ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0
  const bytesSaved = originalSize - compressedSize
  const hasResult = !!result

  const processContent = useCallback((content: string, name = 'optimized.svg', options = opts) => {
    setError('')
    if (!content.trim()) return
    if (!/<svg[\s>]/i.test(content)) {
      setError('Invalid SVG: no <svg> element detected.')
      setOriginalContent('')
      setResult(null)
      return
    }
    setOriginalContent(content)
    setFileName(name)
    setResult(optimizeSvg(content, options))
  }, [opts])

  const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => processContent(e.target?.result as string, file.name)
    reader.readAsText(file)
  }, [processContent])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/svg+xml': ['.svg'] },
    maxFiles: 1,
  })

  const handlePaste = (value: string) => {
    setPasteValue(value)
    if (value.trim()) {
      processContent(value, 'pasted.svg')
    } else {
      setOriginalContent('')
      setResult(null)
      setError('')
    }
  }

  const handleOptionChange = (key: keyof OptimizationOptions, value: boolean) => {
    const next = { ...opts, [key]: value }
    setOpts(next)
    if (originalContent) processContent(originalContent, fileName, next)
  }

  const reset = () => {
    setOriginalContent('')
    setResult(null)
    setFileName('')
    setPasteValue('')
    setError('')
  }

  const download = () => {
    const blob = new Blob([compressedContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName ? `optimized_${fileName}` : 'optimized.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(compressedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white">

      {/* ── Hero header ── */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700 font-medium">SVG Compressor</span>
          </nav>

          <div className="flex items-start gap-5">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-200/60">
              <FileCode2 className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1.5">
                SVG Compressor
              </h1>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl mb-4">
                Strip bloat from design-tool exports. Removes metadata, editor data, unused IDs, redundant transforms, and more — all without touching a single pixel.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                  <Lock className="h-3 w-3" /> 100% Private
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                  <Globe className="h-3 w-3" /> Browser-only
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-100 rounded-full px-3 py-1">
                  <Sparkles className="h-3 w-3" /> 14 optimizations
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-5">

        {/* ── Input card ── */}
        <Card className="border-0 shadow-sm ring-1 ring-gray-200/80">
          <CardContent className="p-5 sm:p-6">
            <Tabs value={inputTab} onValueChange={(v) => setInputTab(v as 'file' | 'paste')}>
              <div className="flex items-center justify-between mb-4">
                <TabsList className="h-9 bg-gray-100/80 rounded-xl p-1 gap-0.5">
                  <TabsTrigger value="file" className="rounded-lg text-sm px-4 data-[state=active]:shadow-sm">
                    <Upload className="h-3.5 w-3.5 mr-1.5" />Upload File
                  </TabsTrigger>
                  <TabsTrigger value="paste" className="rounded-lg text-sm px-4 data-[state=active]:shadow-sm">
                    <Code2 className="h-3.5 w-3.5 mr-1.5" />Paste Code
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  {hasResult && (
                    <Button variant="ghost" size="sm" onClick={reset} className="h-8 text-gray-400 hover:text-gray-600 rounded-lg gap-1.5 text-xs">
                      <RotateCcw className="h-3.5 w-3.5" />Reset
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className={cn('h-8 rounded-lg gap-1.5 text-xs transition-colors', showSettings ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700')}
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                    Settings
                    {showSettings ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                </div>
              </div>

              <TabsContent value="file" className="mt-0">
                <div
                  {...getRootProps()}
                  className={cn(
                    'relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
                    isDragActive
                      ? 'border-cyan-400 bg-cyan-50/60 scale-[1.01]'
                      : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50/60',
                  )}
                >
                  <input {...getInputProps()} />
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors', isDragActive ? 'bg-cyan-100' : 'bg-gray-100')}>
                    <Upload className={cn('h-5 w-5 transition-colors', isDragActive ? 'text-cyan-600' : 'text-gray-400')} />
                  </div>
                  {isDragActive ? (
                    <p className="text-sm font-semibold text-cyan-600">Drop your SVG here</p>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-gray-700">Drag & drop or <span className="text-cyan-600">browse</span></p>
                      <p className="text-xs text-gray-400 mt-1.5">SVG files only · No size limit · No upload</p>
                    </>
                  )}
                </div>
                {fileName && !error && (
                  <div className="mt-3 px-4 py-2.5 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100/80 rounded-xl text-sm flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                      <FileCode2 className="h-4 w-4 text-cyan-600" />
                    </div>
                    <span className="font-medium text-gray-800 truncate">{fileName}</span>
                    <span className="text-gray-400 shrink-0 ml-auto text-xs">{formatSize(originalSize)}</span>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="paste" className="mt-0">
                <Textarea
                  value={pasteValue}
                  onChange={(e) => handlePaste(e.target.value)}
                  placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; ...>…</svg>"
                  className="min-h-[176px] font-mono text-xs rounded-xl resize-none bg-gray-50/50 border-gray-200 focus:border-cyan-300 focus:ring-cyan-200/40 placeholder:text-gray-300"
                />
              </TabsContent>
            </Tabs>

            {/* Settings panel */}
            {showSettings && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Optimization settings</p>
                <div className="grid sm:grid-cols-2 gap-1">
                  {OPTION_DEFS.map(({ key, label, description }) => (
                    <label key={key} className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer group">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{label}</div>
                        <div className="text-xs text-gray-400 truncate">{description}</div>
                      </div>
                      <Switch
                        checked={opts[key]}
                        onCheckedChange={(v) => handleOptionChange(key, v)}
                        className="shrink-0 data-[state=checked]:bg-cyan-500"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2.5 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Results ── */}
        {hasResult && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm ring-1 ring-gray-100">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Original</div>
                <div className="text-xl font-bold text-gray-800">{formatSize(originalSize)}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm ring-1 ring-gray-100">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Compressed</div>
                <div className="text-xl font-bold text-gray-800">{formatSize(compressedSize)}</div>
              </div>
              <div className={cn(
                'rounded-xl p-4 text-center shadow-sm ring-1',
                savingsPercent >= 30 ? 'bg-emerald-50 ring-emerald-100'
                : savingsPercent > 0 ? 'bg-green-50 ring-green-100'
                : 'bg-gray-50 ring-gray-100'
              )}>
                <div className={cn('text-[11px] font-semibold uppercase tracking-wider mb-1.5', savingsPercent > 0 ? 'text-emerald-600' : 'text-gray-400')}>Saved</div>
                <div className={cn('text-xl font-bold', savingsPercent > 0 ? 'text-emerald-700' : 'text-gray-600')}>
                  {savingsPercent > 0 ? `${savingsPercent}%` : '—'}
                </div>
                {bytesSaved > 0 && <div className="text-xs text-emerald-500 mt-0.5">{formatSize(bytesSaved)}</div>}
              </div>
            </div>

            {/* Compression bar + optimization report */}
            <Card className="border-0 shadow-sm ring-1 ring-gray-200/80 overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                {savingsPercent > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <TrendingDown className="h-4 w-4 text-emerald-500" />
                        {savingsPercent}% reduction
                      </span>
                      <span className="text-xs text-gray-400">{formatSize(originalSize)} → {formatSize(compressedSize)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-700"
                        style={{ width: `${Math.max(savingsPercent, 3)}%` }}
                      />
                    </div>
                  </>
                )}

                {/* Optimization steps */}
                {result && result.steps.length > 0 && (
                  <>
                    <button
                      onClick={() => setShowSteps(!showSteps)}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showSteps ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {showSteps ? 'Hide' : 'Show'} optimization report ({result.steps.length} passes applied)
                    </button>
                    {showSteps && (
                      <div className="mt-3 space-y-1.5">
                        {result.steps.map((step, i) => (
                          <div key={i} className="flex items-center justify-between gap-3 text-xs py-1.5 px-3 rounded-lg bg-gray-50">
                            <span className="text-gray-600 font-medium">{step.label}</span>
                            <span className="shrink-0 text-emerald-600 font-semibold tabular-nums">−{formatSize(step.savedBytes)}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between gap-3 text-xs py-1.5 px-3 rounded-lg bg-emerald-50 font-semibold">
                          <span className="text-emerald-700">Total saved</span>
                          <span className="text-emerald-700 tabular-nums">−{formatSize(bytesSaved)}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Preview + Code card */}
            <Card className="border-0 shadow-sm ring-1 ring-gray-200/80">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div className="flex rounded-xl bg-gray-100/80 p-1 gap-0.5">
                    {([
                      { id: 'original',   label: 'Original',    icon: <Eye className="h-3.5 w-3.5" /> },
                      { id: 'compressed', label: 'Optimized',   icon: <Sparkles className="h-3.5 w-3.5" /> },
                      { id: 'code',       label: 'Code',        icon: <Code2 className="h-3.5 w-3.5" /> },
                    ] as const).map(({ id, label, icon }) => (
                      <button
                        key={id}
                        onClick={() => setPreviewTab(id)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all',
                          previewTab === id
                            ? 'bg-white shadow-sm font-semibold text-gray-900'
                            : 'text-gray-500 hover:text-gray-700',
                        )}
                      >
                        {icon}{label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyCode}
                      className={cn('h-8 rounded-lg gap-1.5 text-xs transition-all', copied && 'border-emerald-200 text-emerald-700 bg-emerald-50')}
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied!' : 'Copy SVG'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={download}
                      className="h-8 rounded-lg gap-1.5 text-xs bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0"
                    >
                      <Download className="h-3.5 w-3.5" />Download
                    </Button>
                  </div>
                </div>

                {/* Preview panes */}
                {previewTab === 'original' && (
                  <div className="border rounded-xl overflow-hidden" style={{ backgroundImage: `url("${CHECKERBOARD}")` }}>
                    <div
                      className="flex items-center justify-center min-h-[200px] p-6"
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: sanitizeForPreview(originalContent) }}
                    />
                    <div className="bg-white/90 backdrop-blur-sm border-t px-4 py-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Original</span>
                      <span className="text-xs font-semibold text-gray-700 tabular-nums">{formatSize(originalSize)}</span>
                    </div>
                  </div>
                )}

                {previewTab === 'compressed' && (
                  <div className="border rounded-xl overflow-hidden" style={{ backgroundImage: `url("${CHECKERBOARD}")` }}>
                    <div
                      className="flex items-center justify-center min-h-[200px] p-6"
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: sanitizeForPreview(compressedContent) }}
                    />
                    <div className="bg-white/90 backdrop-blur-sm border-t px-4 py-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Optimized</span>
                      <span className="text-xs font-semibold text-emerald-600 tabular-nums">{formatSize(compressedSize)}</span>
                    </div>
                  </div>
                )}

                {previewTab === 'code' && (
                  <div className="relative rounded-xl overflow-hidden">
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={copyCode}
                        className={cn(
                          'flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all font-medium',
                          copied ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                        )}
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="bg-gray-950 p-5 overflow-auto max-h-80">
                      <pre className="text-xs text-emerald-400 font-mono whitespace-pre-wrap break-all leading-relaxed pr-14">
                        {compressedContent}
                      </pre>
                    </div>
                    <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{compressedContent.length.toLocaleString()} chars</span>
                      <span className="text-xs text-emerald-500 font-semibold">{formatSize(compressedSize)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* ── What it does ── */}
        <div className="pt-6 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-1.5">What gets optimized</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            SVGs from Illustrator, Inkscape, and Figma are padded with editor metadata, comments, and legacy cruft that adds bytes without affecting rendering. This tool strips all of it.
          </p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {[
              { icon: <FileSearch className="h-4 w-4 text-cyan-500" />,   text: 'XML declarations, DOCTYPE, & comments' },
              { icon: <Layers className="h-4 w-4 text-blue-500" />,       text: 'Editor metadata, title & desc elements' },
              { icon: <Shield className="h-4 w-4 text-violet-500" />,     text: 'Inkscape, Figma, & Illustrator namespaces' },
              { icon: <Palette className="h-4 w-4 text-pink-500" />,      text: 'Color values shortened (#ffcc00 → #fc0)' },
              { icon: <Hash className="h-4 w-4 text-orange-500" />,       text: 'Floating-point precision reduced safely' },
              { icon: <Zap className="h-4 w-4 text-yellow-500" />,        text: 'Path data & polygon points minified' },
              { icon: <Zap className="h-4 w-4 text-emerald-500" />,       text: 'Identity transforms removed (translate(0,0))' },
              { icon: <Minimize2 className="h-4 w-4 text-teal-500" />,    text: 'SVG default attribute values stripped' },
              { icon: <Layers className="h-4 w-4 text-indigo-500" />,     text: '<style> blocks and inline styles minified' },
              { icon: <Hash className="h-4 w-4 text-red-400" />,          text: 'Unused id="" attributes removed' },
              { icon: <FileSearch className="h-4 w-4 text-gray-500" />,   text: 'data-* editor attributes eliminated' },
              { icon: <Layers className="h-4 w-4 text-cyan-400" />,       text: 'Empty <g>, <defs>, <mask> elements pruned' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                <div className="mt-0.5 shrink-0">{icon}</div>
                <span className="text-sm text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="pt-2 pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Will compression affect the visual quality?',
                a: 'No — SVG is a vector format. Every optimization we apply targets non-visual data: whitespace, comments, editor metadata, redundant attributes, and equivalent shorter representations. The rendered image is pixel-identical.',
              },
              {
                q: 'How does this compare to SVGO?',
                a: 'We implement the same safe optimizations SVGO does for browser-side usage: namespace cleanup, color shortening, default removal, path minification, transform simplification, unused ID removal, and more. No server upload needed.',
              },
              {
                q: 'Are my files uploaded anywhere?',
                a: 'Never. Every optimization runs directly in your browser using JavaScript. Your SVG data never leaves your device — no server, no logging, no tracking.',
              },
              {
                q: 'Can I paste SVG code directly instead of uploading?',
                a: 'Yes — switch to the "Paste Code" tab and paste your markup. The output updates instantly as you type, so you can tweak the input and see the compressed result in real time.',
              },
              {
                q: 'Why are some files compressed less than others?',
                a: 'Files hand-coded or already optimized contain less editor noise. Compression is highest on exports from Illustrator or Inkscape, which embed extensive editor-specific metadata.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100/70 transition-colors">
                <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
