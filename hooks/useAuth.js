'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Keep sessionStorage in sync with the NextAuth session token
  useEffect(() => {
    if (session?.backendToken) {
      sessionStorage.setItem('toybox_backend_token', session.backendToken)
    } else if (status === 'unauthenticated') {
      sessionStorage.removeItem('toybox_backend_token')
    }
  }, [session, status])

  const logout = async () => {
    sessionStorage.removeItem('toybox_backend_token')
    await signOut({ callbackUrl: '/' })
  }

  return {
    user:        session?.user     || null,
    isLoggedIn:  status === 'authenticated',
    isAdmin:     session?.user?.is_admin || false,
    isLoading:   status === 'loading',
    logout,
  }
}
