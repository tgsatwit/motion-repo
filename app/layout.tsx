import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { site } from "@/lib/site"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-face" })

export const metadata: Metadata = {
  title: { default: site.docsTitle, template: `%s · ${site.docsTitle}` },
  description: site.description,
}

// Runs before paint so the saved theme never flashes.
const themeScript = `(() => {
  try {
    const saved = localStorage.getItem("theme")
    const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches
    document.documentElement.dataset.theme = dark ? "dark" : "light"
  } catch {}
})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
