"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  HighlightGroup,
  HighlightItem,
  useHighlightRest,
} from "@/registry/kinematic/ui/fluid-highlight"

const TableBodyContext = React.createContext(false)

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <HighlightGroup
      data-slot="table-container"
      className="w-full overflow-x-auto"
      highlightClassName="rounded-none bg-muted/50"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </HighlightGroup>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({
  className,
  onPointerLeave,
  ...props
}: React.ComponentProps<"tbody">) {
  const rest = useHighlightRest()

  return (
    <TableBodyContext.Provider value>
      <tbody
        data-slot="table-body"
        className={cn("[&_tr:last-child]:border-0", className)}
        onPointerLeave={(event) => {
          rest()
          onPointerLeave?.(event)
        }}
        {...props}
      />
    </TableBodyContext.Provider>
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <TableBodyContext.Provider value={false}>
      <tfoot
        data-slot="table-footer"
        className={cn(
          "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
          className
        )}
        {...props}
      />
    </TableBodyContext.Provider>
  )
}

function TableRowElement({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableRow(props: React.ComponentProps<"tr">) {
  const inBody = React.useContext(TableBodyContext)
  if (!inBody) return <TableRowElement {...props} />

  return (
    <HighlightItem asChild>
      <TableRowElement {...props} />
    </HighlightItem>
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
