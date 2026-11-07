import type { Metadata } from "next"

import { Hero } from "@/components/landing/hero"

const title = "HireLoop – Find Your Dream Job Today"

const description =
  "Search curated job openings by title, skill, company or location. HireLoop connects top talent with world-class companies so you can land your next role faster."

/**
 * Homepage SEO metadata.
 *
 * - `title` is not set: the layout's default title already fits this page,
 *   and the "%s | HireLoop" template only applies to child pages like /pricing.
 * - `canonical: "/"` tells search engines the root URL is the official one,
 *   so variants such as /?ref=ad are not treated as duplicate pages.
 * - `openGraph` and `twitter` replace the layout's objects completely
 *   (shallow merge), so shared fields like `siteName`, `type` and `locale`
 *   are repeated here on purpose.
 * - The description avoids numbers (jobs, users) until the real data exists,
 *   so the snippet in Google never promises more than the site delivers.
 */
export const metadata: Metadata = {
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "HireLoop",
    locale: "en_US",
    url: "/",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
}

/**
 * Landing page. The <main> landmark lives in the root layout, so this page
 * returns its sections directly. Future sections (trusted companies,
 * features, how it works, CTA) go below <Hero /> and each one should
 * use an <h2>, because the hero already owns the page's single <h1>.
 */
export default function Page() {
  return <Hero />
}
