import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Focus Hive',
  description: 'An Ecosystem of inverconneted productivity tools',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
