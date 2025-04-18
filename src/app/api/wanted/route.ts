import { NextResponse } from 'next/server'

// Proxy endpoint to fetch and transform data from the FBI Wanted API
import redisClient from '@/lib/redis'

// Proxy endpoint to fetch and transform data from the FBI Wanted API, with Redis caching and search
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '16', 10)
  const searchTerm = searchParams.get('search')?.toLowerCase().trim()

  // Helper to transform raw FBI item into our WantedPerson shape
  function transform(item: any) {
    const minH = item.height_min
    const maxH = item.height_max
    let height: string | null = null
    if (typeof minH === 'number' && typeof maxH === 'number') {
      height = minH === maxH ? `${minH}` : `${minH}-${maxH}`
    }
    return {
      id: item.uid,
      title: item.title,
      description: item.description,
      url: item.url,
      image: item.images?.[0]?.thumb || null,
      dates_of_birth_used: Array.isArray(item.dates_of_birth_used)
        ? item.dates_of_birth_used
        : [],
      hair: item.hair || '',
      sex: item.sex || '',
      race: item.race || '',
      eyes: item.eyes || '',
      height,
      scars_and_marks: item.scars_and_marks || '',
    }
  }

  // SEARCH: query FBI API by title (do not cache search results)
  if (searchTerm) {
    const apiUrl = `https://api.fbi.gov/wanted/v1/list?title=${encodeURIComponent(
      searchTerm
    )}&page=${page}&limit=${limit}`
    try {
      const res = await fetch(apiUrl)
      if (!res.ok) {
        return NextResponse.json(
          { error: `FBI API responded with status ${res.status}` },
          { status: res.status }
        )
      }
      const json = await res.json()
      const rawItems = Array.isArray(json.items) ? json.items : []
      // Transform and add page to each record
      const records = rawItems.map((item) => {
        const rec = transform(item)
        return { ...rec, page }
      })
      const total = json.total || 0
      const pagesCount = Math.ceil(total / limit)
      // Cache each record individually
      await Promise.all(
        records.map((rec) =>
          redisClient.set(
            `wanted:item:${rec.id}`,
            JSON.stringify(rec),
            { EX: 60 * 5 }
          )
        )
      )
      const result = { data: records, total, page, pages: pagesCount, limit }
      return NextResponse.json(result)
    } catch (error) {
      console.error('Error searching FBI Wanted API:', error)
      return NextResponse.json(
        { error: 'Internal server error during search' },
        { status: 500 }
      )
    }
  }

  // PAGING: attempt to serve from cache of item IDs, then fetch individual items
  const pageKey = `wanted:page=${page}:limit=${limit}`
  const cachedPage = await redisClient.get(pageKey)
  if (cachedPage) {
    try {
      const pageInfo = JSON.parse(cachedPage) as {
        ids: string[]
        total: number
        pages: number
        limit: number
      }
      const items = await Promise.all(
        pageInfo.ids.map(async (id) => {
          const str = await redisClient.get(`wanted:item:${id}`)
          return str ? JSON.parse(str) : null
        })
      )
      // if all items are in cache, return them
      if (items.every((it) => it !== null)) {
        return NextResponse.json({
          data: items as any[],
          total: pageInfo.total,
          page,
          pages: pageInfo.pages,
          limit: pageInfo.limit,
        })
      }
    } catch {
      // parse error or missing data: fall through to refetch
    }
  }

  // Fetch this page from FBI API and cache items individually
  const apiUrl = `https://api.fbi.gov/wanted/v1/list?page=${page}&limit=${limit}`
  try {
    const res = await fetch(apiUrl)
    if (!res.ok) {
      return NextResponse.json(
        { error: `FBI API responded with status ${res.status}` },
        { status: res.status }
      )
    }
    const json = await res.json()
    const rawItems = Array.isArray(json.items) ? json.items : []
    const records = rawItems.map((item) => {
      const rec = transform(item)
      return { ...rec, page }
    })
    const total = json.total || 0
    const pagesCount = Math.ceil(total / limit)
    // cache each item
    await Promise.all(
      records.map((rec) =>
        redisClient.set(
          `wanted:item:${rec.id}`,
          JSON.stringify(rec),
          { EX: 60 * 5 }
        )
      )
    )
    // cache page mapping (ids + metadata)
    const ids = records.map((rec) => rec.id)
    const pageInfo = { ids, total, pages: pagesCount, limit }
    await redisClient.set(pageKey, JSON.stringify(pageInfo), { EX: 60 * 5 })
    return NextResponse.json({ data: records, total, page, pages: pagesCount, limit })
  } catch (error) {
    console.error('Error fetching FBI Wanted API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}