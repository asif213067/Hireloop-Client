import type { Metadata, Viewport } from "next"
import { Manrope, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { Navbar } from "@/components/shared/navbar"
import { cn } from "@/lib/utils"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
const siteName = "HireLoop"
const siteDescription =
  "HireLoop connects top talent with world-class companies. Search curated job openings by title, skill, company or location and find your next role faster."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HireLoop – Find Your Dream Job Today",
    template: "%s | HireLoop",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "job search",
    "job board",
    "remote jobs",
    "tech jobs",
    "careers",
    "hiring platform",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  openGraph: {
    type: "website",
    siteName,
    locale: "en_US",
    title: "HireLoop – Find Your Dream Job Today",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "HireLoop – Find Your Dream Job Today",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  themeColor: "#060608",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/images/logo.png`,
    },
    {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn("dark", manrope.variable, jetbrains.variable)}
    >
      <body className="min-h-dvh font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
      </body>
    </html>
  )
}
