"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/Input'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/Select'
import { Button } from '@/components/Button'
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowRightDoubleLine,
} from '@remixicon/react'
import { DataTable } from '@/components/ui/data-table/DataTable'
import { wantedColumns, WantedPerson } from '@/components/ui/data-table-wanted/columns'
import WantedDetailDrawer from '@/components/ui/WantedDetailDrawer'

interface Props {
  /** Initial data for the first page */
  initialData: WantedPerson[]
  /** Initial page number (1-based) */
  initialPage: number
  /** Total number of records */
  total: number
  /** Total number of pages */
  totalPages: number
  /** Page size (records per page) */
  pageSize: number
}

export default function WantedTableWithDrawer({
  initialData,
  initialPage,
  total,
  totalPages,
  pageSize,
}: Props) {
  const [data, setData] = useState<WantedPerson[]>(initialData)
  const [page, setPage] = useState<number>(initialPage)
  const [pages, setPages] = useState<number>(totalPages)
  const [totalCount, setTotalCount] = useState<number>(total)
  const [searchTerm, setSearchTerm] = useState<string>('')
  // Filter states
  const [hairFilter, setHairFilter] = useState<string>('')
  const [sexFilter, setSexFilter] = useState<string>('')
  const [raceFilter, setRaceFilter] = useState<string>('')
  const [heightFilter, setHeightFilter] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [selected, setSelected] = useState<WantedPerson | null>(null)
  const [open, setOpen] = useState(false)
  // Derive filter options from current data
  const hairOptions = useMemo(() => Array.from(new Set(data.map((item) => item.hair).filter(Boolean))), [data])
  const sexOptions = useMemo(() => Array.from(new Set(data.map((item) => item.sex).filter(Boolean))), [data])
  const raceOptions = useMemo(() => Array.from(new Set(data.map((item) => item.race).filter(Boolean))), [data])
  const heightOptions = useMemo(() => Array.from(new Set(data.map((item) => item.height || '').filter(Boolean))), [data])

  const handleRowClick = (row: WantedPerson) => {
    setSelected(row)
    setOpen(true)
  }

  // Fetch a given page (and optional search) from the API
  const fetchPage = async (newPage: number, search?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(newPage), limit: String(pageSize) })
      if (search) params.set('search', search)
      const res = await fetch(`/api/wanted?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load page')
      const json = await res.json() as {
        data: WantedPerson[]
        total: number
        page: number
        pages: number
        limit: number
      }
      setData(json.data)
      setPage(json.page)
      setPages(json.pages)
      setTotalCount(json.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Apply client-side filters to the current page of data
  const filteredData = useMemo(
    () => data.filter((item) => {
      if (hairFilter && item.hair !== hairFilter) return false
      if (sexFilter && item.sex !== sexFilter) return false
      if (raceFilter && item.race !== raceFilter) return false
      if (heightFilter && (item.height || '') !== heightFilter) return false
      return true
    }),
    [data, hairFilter, sexFilter, raceFilter, heightFilter]
  )
  return (
    <>
      {/* Search and filter bar */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => {
              const val = e.target.value
              setSearchTerm(val)
              fetchPage(1, val)
            }}
            placeholder="Search by name..."
          />
        </div>
        <div className="min-w-[150px]">
          <Select
            value={hairFilter || undefined}
            onValueChange={(v) => setHairFilter(v === 'all' ? '' : v)}
          >
            <SelectTrigger>Hair</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {hairOptions.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[150px]">
          <Select
            value={sexFilter || undefined}
            onValueChange={(v) => setSexFilter(v === 'all' ? '' : v)}
          >
            <SelectTrigger>Sex</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {sexOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[150px]">
          <Select
            value={raceFilter || undefined}
            onValueChange={(v) => setRaceFilter(v === 'all' ? '' : v)}
          >
            <SelectTrigger>Race</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {raceOptions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[150px]">
          <Select
            value={heightFilter || undefined}
            onValueChange={(v) => setHeightFilter(v === 'all' ? '' : v)}
          >
            <SelectTrigger>Height</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {heightOptions.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="secondary" onClick={() => {
          setHairFilter('')
          setSexFilter('')
          setRaceFilter('')
          setHeightFilter('')
        }}>
          Clear Filters
        </Button>
      </div>
      <DataTable
        data={filteredData}
        columns={wantedColumns}
        onRowClick={handleRowClick}
        hidePagination
      />
      {selected && (
        <WantedDetailDrawer
          person={selected}
          open={open}
          onOpenChange={setOpen}
        />
      )}
      <div className="flex items-center justify-between p-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {loading ? (
            'Loading...'
          ) : (
            <>
              Showing {(page - 1) * pageSize + 1} -{' '}
              {Math.min(page * pageSize, totalCount)} of {totalCount}
            </>
          )}
        </div>
        <div className="flex items-center gap-x-1.5">
          <Button
            variant="secondary"
            className="hidden sm:block p-1.5"
            disabled={page <= 1 || loading}
            onClick={() => fetchPage(1, searchTerm)}
          >
            <span className="sr-only">First page</span>
            <RiArrowLeftDoubleLine className="size-4 shrink-0" aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            className="p-1.5"
            disabled={page <= 1 || loading}
            onClick={() => fetchPage(page - 1, searchTerm)}
          >
            <span className="sr-only">Previous page</span>
            <RiArrowLeftSLine className="size-4 shrink-0" aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            className="p-1.5"
            disabled={page >= pages || loading}
            onClick={() => fetchPage(page + 1, searchTerm)}
          >
            <span className="sr-only">Next page</span>
            <RiArrowRightSLine className="size-4 shrink-0" aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            className="hidden sm:block p-1.5"
            disabled={page >= pages || loading}
            onClick={() => fetchPage(pages, searchTerm)}
          >
            <span className="sr-only">Last page</span>
            <RiArrowRightDoubleLine className="size-4 shrink-0" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </>
  )
}