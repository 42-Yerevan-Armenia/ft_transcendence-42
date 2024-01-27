import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <header>
            <h1>ft_transcendence</h1>
          </header>
          {children}
          <footer>
            &copy; 2023 all rights reserved
          </footer>
        </main>
      </body>
    </html>
  )
}