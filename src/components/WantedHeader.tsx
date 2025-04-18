"use client"

import { DropdownUserProfile } from "@/components/ui/UserProfile"
import { SessionProvider } from "next-auth/react"

export default function Header() {
  return (
    <div className="flex h-[42px] flex-nowrap gap-1">
      <SessionProvider>
        <DropdownUserProfile />
      </SessionProvider>
    </div>
  )
}
