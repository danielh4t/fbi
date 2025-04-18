// server component: fetch from our proxy API and render in a DataTable
import { Divider } from '@/components/Divider'
import WantedTableWithDrawer from '@/components/WantedTableWithDrawer'
import { WantedPerson } from '@/components/ui/data-table-wanted/columns'

export default async function Wanted() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/wanted?page=1&limit=16`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch wanted data')
  }
  // Response contains data and pagination metadata
  const json = await res.json() as {
    data: WantedPerson[]
    total: number
    page: number
    pages: number
    limit: number
  }
  const { data, total, page, pages, limit } = json
  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            FBI Most Wanted
          </h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">
            Up-to-date list of FBI’s most wanted suspects and fugitives
          </p>
        </div>
      </div>
      <Divider />
      <section className="mt-8">
        <WantedTableWithDrawer
          initialData={data}
          initialPage={page}
          total={total}
          totalPages={pages}
          pageSize={limit}
        />
      </section>
    </main>
  )
}