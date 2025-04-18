import { Logo } from "../../../public/Logo"
import WantedHeader from "@/components/WantedHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
     <div className="shadow-s sticky top-0 z-20 bg-white dark:bg-gray-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-3 sm:px-6">
        <div>
          <span className="sr-only">Wanted</span>
          <Logo className="h-6" />
        </div>
        <div className="flex h-[42px] flex-nowrap gap-1">
         <WantedHeader />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">{children}</div>
      </div>
    </>
  )
}
