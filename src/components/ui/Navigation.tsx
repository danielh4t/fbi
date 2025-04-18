"use client"

import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "../../../public/Logo"
import { DropdownUserProfile } from "./UserProfile"
import { SessionProvider } from "next-auth/react"

function Navigation() {
  const pathname = usePathname()
  return (
    <div className="shadow-s sticky top-0 z-20 bg-white dark:bg-gray-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-3 sm:px-6">
        <div>
          <span className="sr-only">Wanted</span>
          <Logo className="h-6" />
        </div>
        <div className="flex h-[42px] flex-nowrap gap-1">
          <SessionProvider>
            <DropdownUserProfile />
          </SessionProvider>
        </div>
      </div>
      <TabNavigation className="mt-5">
        <div className="mx-auto flex w-full max-w-7xl items-center px-6">
        <TabNavigationLink
            className="inline-flex gap-2"
            asChild
            active={pathname === "/wanted"}
          >
            <Link href="/wanted">Wanted</Link>
          </TabNavigationLink>

          <TabNavigationLink
            className="inline-flex gap-2"
            asChild
            active={pathname === "/agents"}
          >
            <Link href="/agents">Agents</Link>
          </TabNavigationLink>
        </div>
      </TabNavigation>
    </div>
  )
}

export { Navigation }
