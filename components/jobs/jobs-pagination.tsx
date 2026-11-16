import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

type JobsPaginationProps = {
  params: URLSearchParams
  currentPage: number
  totalPages: number
}

// href for a page, keeping every other param; page is omitted for 1
function hrefFor(params: URLSearchParams, page: number): string {
  const next = new URLSearchParams(params)
  if (page === 1) next.delete("page")
  else next.set("page", String(page))
  const query = next.toString()
  return query === "" ? "/jobs" : `/jobs?${query}`
}

// First page, last page and the current page ±1, sorted
function pagesToShow(currentPage: number, totalPages: number): number[] {
  const pages = new Set(
    [1, totalPages, currentPage - 1, currentPage, currentPage + 1].filter(
      (page) => page >= 1 && page <= totalPages
    )
  )
  return [...pages].sort((a, b) => a - b)
}

const pageLinkClass =
  "flex h-11 min-w-11 items-center justify-center rounded-lg border border-border px-2 text-sm font-medium text-foreground outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"

// Page links for the jobs list; renders nothing for a single page
export function JobsPagination({
  params,
  currentPage,
  totalPages,
}: JobsPaginationProps) {
  if (totalPages <= 1) return null

  const pages = pagesToShow(currentPage, totalPages)

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex flex-wrap items-center justify-center gap-1.5"
    >
      {currentPage > 1 ? (
        <Link
          href={hrefFor(params, currentPage - 1)}
          aria-label={`Previous page, page ${currentPage - 1}`}
          className={pageLinkClass}
        >
          <ChevronLeftIcon aria-hidden className="size-4" />
        </Link>
      ) : null}
      {pages.map((page, index) => (
        <span key={page} className="flex items-center gap-1.5">
          {index > 0 && page - pages[index - 1] > 1 ? (
            <span
              aria-hidden
              className="flex h-11 min-w-6 items-center justify-center text-sm text-muted-foreground"
            >
              …
            </span>
          ) : null}
          {page === currentPage ? (
            <span
              aria-current="page"
              aria-label={`Page ${page}, current page`}
              className="flex h-11 min-w-11 items-center justify-center rounded-lg border border-transparent bg-foreground px-2 text-sm font-medium text-background"
            >
              {page}
            </span>
          ) : (
            <Link
              href={hrefFor(params, page)}
              aria-label={`Page ${page}`}
              className={pageLinkClass}
            >
              {page}
            </Link>
          )}
        </span>
      ))}
      {currentPage < totalPages ? (
        <Link
          href={hrefFor(params, currentPage + 1)}
          aria-label={`Next page, page ${currentPage + 1}`}
          className={pageLinkClass}
        >
          <ChevronRightIcon aria-hidden className="size-4" />
        </Link>
      ) : null}
    </nav>
  )
}
