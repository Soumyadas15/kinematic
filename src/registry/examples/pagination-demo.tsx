"use client"

import * as React from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/kinematic/ui/pagination"

const totalPages = 12

function pageWindow(page: number) {
  if (page <= 3) return [1, 2, 3, 4, "end"] as const
  if (page >= totalPages - 2) {
    return ["start", totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const
  }
  return ["start", page - 1, page, page + 1, "end"] as const
}

export default function PaginationDemo() {
  const [page, setPage] = React.useState(1)

  function go(next: number) {
    return (event: React.MouseEvent) => {
      event.preventDefault()
      setPage(Math.min(totalPages, Math.max(1, next)))
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1}
              onClick={go(page - 1)}
            />
          </PaginationItem>
          {page > 3 && (
            <PaginationItem>
              <PaginationLink href="#" onClick={go(1)}>
                1
              </PaginationLink>
            </PaginationItem>
          )}
          {pageWindow(page).map((entry) =>
            typeof entry === "number" ? (
              <PaginationItem key={entry}>
                <PaginationLink href="#" isActive={entry === page} onClick={go(entry)}>
                  {entry}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={entry}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          )}
          {page < totalPages - 2 && (
            <PaginationItem>
              <PaginationLink href="#" onClick={go(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === totalPages}
              onClick={go(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <span className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </span>
    </div>
  )
}
