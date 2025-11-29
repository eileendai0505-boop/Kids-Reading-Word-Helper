'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, List, Home } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              Word Helper
            </span>
          </Link>

          <div className="flex space-x-8">
            <Link
              href="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/groups"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/groups'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4" />
              <span>Groups</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}