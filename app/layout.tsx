import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundEffect from "@/components/background-effect"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HiveFi - Algorithmic Trading for DeFi",
  icons: [{ rel: 'icon', url: "/favicon.ico" }],
  description:
    "Create, backtest, and deploy algorithmic trading strategies with a visual interface. Invest in verified strategies or share your expertise with the world.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <BackgroundEffect />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'