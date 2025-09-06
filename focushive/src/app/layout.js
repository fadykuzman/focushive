import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
})

export const metadata = {
  title: 'BelugaFocus - Navigate Your Productivity',
  description: 'Navigate your productivity with intelligent focus sessions and deep work management. Privacy-first productivity timer with task management and session tracking.',
  keywords: ['productivity', 'focus', 'time-management', 'deep-work', 'task-management', 'workflow', 'pomodoro-alternative'],
  authors: [{ name: 'BelugaFocus Team' }],
  creator: 'BelugaFocus Team',
  publisher: 'BelugaFocus',
  openGraph: {
    title: 'BelugaFocus - Navigate Your Productivity',
    description: 'Privacy-first productivity timer with intelligent focus sessions and task management',
    url: 'https://belugafocus.space',
    siteName: 'BelugaFocus',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BelugaFocus - Navigate Your Productivity',
    description: 'Privacy-first productivity timer with intelligent focus sessions',
    creator: '@belugafocus',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    // Google Search Console verification will be added here
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>{children}</body>
    </html>
  )
}
