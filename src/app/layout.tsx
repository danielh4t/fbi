import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { GeistSans } from "geist/font/sans"
import "./globals.css"

export const metadata: Metadata = {
  title: "Wanted",
  description: "FBI Most Wanted dashboard"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} min-h-full bg-white antialiased dark:bg-gray-950`}
      >
        <ThemeProvider
          defaultTheme="system"
          disableTransitionOnChange
          attribute="class"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
