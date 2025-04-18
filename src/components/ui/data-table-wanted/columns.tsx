"use client"

import { DataTableColumnHeader } from "@/components/ui/data-table/DataTableColumnHeader"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Image from "next/image"

/**
 * Represents a wanted person as returned from our /api/wanted endpoint
 */
export interface WantedPerson {
  id: string
  title: string
  description: string
  url: string
  image: string | null
  dates_of_birth_used: string[]
  hair: string
  sex: string
  race: string
  eyes: string
  height: string | null
  scars_and_marks: string
}

const helper = createColumnHelper<WantedPerson>()

export const wantedColumns = [
  // Photo column
  helper.accessor("image", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Photo" />
    ),
    cell: (info) => {
      const src = info.getValue()
      return (
        <Image
          src={src || "/fbi.webp"}
          alt={`Photo of ${info.row.original.title}`}
          height={100}
          width={100}
          className="rounded-lg"
        />
      )
    },
    enableSorting: false,
    meta: { displayName: "Image" },
  }),
  // Name column
  helper.accessor("title", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    enableSorting: false,
    meta: { className: "text-left", displayName: "Name" },
  }),

  helper.accessor("dates_of_birth_used", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DOB Used" />
    ),
    cell: (info) => info.getValue().join(", "),
    enableSorting: false,
    meta: { className: "whitespace-nowrap", displayName: "Date of Birth" },
  }),

  helper.accessor("hair", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hair" />
    ),
    cell: (info) => info.getValue() || "—",
    enableSorting: false,
    meta: { className: "whitespace-nowrap", displayName: "Hair" },
  }),

  helper.accessor("sex", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sex" />
    ),
    cell: (info) => info.getValue(),
    enableSorting: false,
    meta: { className: "whitespace-nowrap", displayName: "Sex" },
  }),
  // Race column
  helper.accessor("race", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Race" />
    ),
    cell: (info) => info.getValue() || "—",
    enableSorting: false,
    meta: { className: "whitespace-nowrap", displayName: "Race" },
  }),

  helper.accessor("height", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Height" />
    ),
    cell: (info) => info.getValue() || "—",
    enableSorting: false,
  }),
] as ColumnDef<WantedPerson, any>[]
