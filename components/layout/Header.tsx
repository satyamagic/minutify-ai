'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/contexts/AuthContext'

interface HeaderProps {
  user?: {
    email: string
  }
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()
  const { logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-800 transition-colors"
        >
          <UserCircleIcon className="h-6 w-6 text-gray-400" />
          <span className="text-gray-300">{user?.email || 'User'}</span>
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            ></div>
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 border border-gray-700 shadow-lg z-20">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
