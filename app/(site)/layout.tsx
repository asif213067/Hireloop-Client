import { Navbar } from "@/components/shared/navbar"

// Public pages live under the navbar with a single main landmark
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
    </>
  )
}
