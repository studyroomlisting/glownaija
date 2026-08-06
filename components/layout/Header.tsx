'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/lib/actions/auth'
import type { Profile } from '@/types/database'
import CartSidebar from '@/components/shop/CartSidebar'

export default function Header() {
  const [user, setUser]       = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [notifs, setNotifs]   = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen]   = useState(false)
  const [notifList, setNotifList]   = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single()
          .then(({ data }) => setProfile(data))
        fetchNotifs()
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchNotifs() {
    const res = await fetch('/api/notifications?limit=10')
    const data = await res.json()
    setNotifs(data.unread_count || 0)
    setNotifList(data.data || [])
  }

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mark_all_read: true }) })
    setNotifs(0)
    setNotifList(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  return (
    <header className="bg-white border-b border-bdr sticky top-0 z-50 shadow-sm">
      <div className="container flex items-center justify-between py-3 gap-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-black tracking-tight flex-shrink-0">
          <span className="text-rose">GLOW</span>
          <span className="text-ink">Naija</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-ink-3">
          <Link href="/salons"  className="hover:text-rose transition-colors">Salons</Link>
          <Link href="/shop"    className="hover:text-rose transition-colors">Shop</Link>
          <Link href="/events"  className="hover:text-rose transition-colors">Events</Link>
          <Link href="/chat"    className="hover:text-rose transition-colors">✦ Glow AI</Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link href="/search" className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-page-2 text-ink-3 transition-colors" aria-label="Search">🔍</Link>

          {user ? (
            <>
              {/* Cart */}
              <CartSidebar/>

              {/* Notification bell */}
              <div className="relative">
                <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead() }}
                  className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-page-2 text-ink-3 transition-colors" aria-label="Notifications">
                  🔔
                  {notifs > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-rose rounded-full px-1">
                      {notifs > 9 ? '9+' : notifs}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-bdr overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-bdr font-bold text-sm">Notifications</div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifList.length === 0
                        ? <div className="text-center py-8 text-ink-3 text-sm">No notifications yet</div>
                        : notifList.map(n => (
                          <Link key={n.id} href={n.link || '#'}
                            className={`flex gap-3 px-4 py-3 border-b border-bdr hover:bg-page-2 transition-colors ${!n.is_read ? 'bg-rose-50' : ''}`}
                            onClick={() => setNotifOpen(false)}>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${!n.is_read ? 'font-bold' : 'font-medium'} text-ink`}>{n.title}</p>
                              {n.body && <p className="text-xs text-ink-3 truncate mt-0.5">{n.body}</p>}
                            </div>
                            {!n.is_read && <div className="w-2 h-2 rounded-full bg-rose flex-shrink-0 mt-1" />}
                          </Link>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* Account menu */}
              <Link href="/account" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-page-2 text-sm font-semibold text-ink transition-colors">
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} className="w-7 h-7 rounded-full object-cover" alt="" />
                  : <div className="w-7 h-7 rounded-full bg-rose flex items-center justify-center text-white text-xs font-bold">{profile?.first_name?.[0] || '?'}</div>
                }
                <span className="hidden lg:block">{profile?.first_name}</span>
              </Link>

              {profile?.account_type === 'owner' && (
                <Link href="/dashboard" className="hidden sm:block btn btn-outline btn-sm">Dashboard</Link>
              )}
              {profile?.is_admin && (
                <Link href="/admin" className="hidden sm:block btn btn-sm bg-ink text-white">Admin</Link>
              )}

              <form action={signOut}>
                <button className="hidden sm:block text-xs text-ink-3 hover:text-rose font-semibold transition-colors px-2">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="btn btn-outline btn-sm hidden sm:flex">Sign In</Link>
              <Link href="/auth/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-page-2 text-ink-3 text-xl">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-bdr bg-white px-4 py-4 flex flex-col gap-3">
          {[['/', 'Home'],['salons','Salons'],['shop','Shop'],['events','Events'],['chat','✦ Glow AI'],['stylist','AI Stylist']].map(([h,l]) => (
            <Link key={h} href={`/${h}`} className="text-sm font-semibold text-ink-2 py-2 border-b border-bdr" onClick={() => setMobileOpen(false)}>{l}</Link>
          ))}
          {user ? (
            <form action={signOut}><button className="text-sm font-semibold text-rose py-2">Sign out</button></form>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link href="/auth/signin" className="btn btn-outline btn-sm flex-1 justify-center">Sign In</Link>
              <Link href="/auth/signup" className="btn btn-primary btn-sm flex-1 justify-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
