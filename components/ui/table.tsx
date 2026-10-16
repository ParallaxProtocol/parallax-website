"use client"

import * as React from "react"
import { Table as TTable, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'

import { cn } from "@/lib/utils"
import { TableHTMLAttributes } from "react"
import { TdProps } from "react-super-responsive-table/dist/esm/types"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <TTable
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <Thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-stroke", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <Tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t border-stroke font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <Tr
      data-slot="table-row"
      className={cn(
        "data-[state=selected]:bg-muted border-b border-hairline hover:bg-muted/60 transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: TableHTMLAttributes<HTMLTableCellElement>) {
  return (
    <Th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-mono text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: TdProps & React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <Td
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
      className={cn("text-muted-foreground mt-4 text-sm", className)}
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
