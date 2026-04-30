'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: '◈', label: 'Tableau de Bord', section: 'analytics' },
  { href: '/dashboard/resultats', icon: '⬡', label: 'Résultats', section: 'analytics' },
  { href: '/dashboard/electeurs', icon: '◉', label: 'Électeurs', section: 'gestion' },
  { href: '/dashboard/candidats', icon: '◈', label: 'Candidats', section: 'gestion' },
  { href: '/dashboard/bureaux', icon: '⬢', label: 'Bureaux de Vote', section: 'gestion' },
  { href: '/dashboard/votes', icon: '◎', label: 'Votes', section: 'gestion' },
  { href: '/dashboard/rapports', icon: '◧', label: 'Rapports', section: 'autres' },
  { href: '/dashboard/parametres', icon: '◦', label: 'Paramètres', section: 'autres' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  function handleLogout() {
    router.push('/auth/login')
  }

  const sections: Record<string, string> = {
    analytics: 'ANALYTIQUE',
    gestion: 'GESTION',
    autres: 'AUTRES',
  }

  const grouped = Object.entries(sections).map(([key, label]) => ({
    label,
    items: NAV_ITEMS.filter(i => i.section === key)
  }))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A1628' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 64, flexShrink: 0,
        background: '#0D1F3C',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 30,
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarOpen ? '20px 20px 16px' : '20px 12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #007A3D, #CE1126)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: '#FCD116'
          }}>★</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#E8ECF4', letterSpacing: '0.02em' }}>E-VOTE CM</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Présidentielle 2025</div>
            </div>
          )}
        </div>

        {/* User badge */}
        {sidebarOpen && (
          <div style={{
            margin: '12px 12px 4px',
            padding: '10px 12px',
            background: 'rgba(21, 101, 192, 0.12)',
            border: '1px solid rgba(21, 101, 192, 0.2)',
            borderRadius: 8,
          }}>
            <div style={{ fontSize: 11, color: '#90CAF9', fontWeight: 600 }}>ADMIN</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>admin@evote.cm</div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {grouped.map(group => (
            <div key={group.label} style={{ marginBottom: 20 }}>
              {sidebarOpen && (
                <div style={{
                  fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.12em', padding: '0 8px', marginBottom: 6,
                }}>
                  {group.label}
                </div>
              )}
              {group.items.map(item => {
                const active = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 10px', borderRadius: 7, marginBottom: 2,
                      background: active ? 'rgba(21, 101, 192, 0.18)' : 'transparent',
                      borderLeft: `2px solid ${active ? '#1565C0' : 'transparent'}`,
                      color: active ? '#90CAF9' : 'rgba(255,255,255,0.45)',
                      fontSize: 13, fontWeight: active ? 600 : 400,
                      transition: 'all 0.15s',
                      cursor: 'pointer',
                    }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                      {sidebarOpen && <span>{item.label}</span>}
                    </div>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Toggle + Logout */}
        <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: '100%', padding: '8px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, color: 'rgba(255,255,255,0.4)',
              fontSize: 12, cursor: 'pointer', marginBottom: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {sidebarOpen ? '◁ Réduire' : '▷'}
          </button>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '8px',
              background: 'rgba(206, 17, 38, 0.1)',
              border: '1px solid rgba(206, 17, 38, 0.2)',
              borderRadius: 6, color: '#EF9A9A',
              fontSize: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {sidebarOpen ? '⊗ Déconnexion' : '⊗'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? 240 : 64,
        transition: 'margin-left 0.25s ease',
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Top bar */}
        <header style={{
          height: 52, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          background: 'rgba(13, 31, 60, 0.8)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#4CAF50', animation: 'pulse 2s infinite',
            }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              Système en ligne — Données en temps réel
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 0, height: 18, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: 18, background: '#007A3D' }} />
              <div style={{ width: 18, background: '#CE1126' }} />
              <div style={{ width: 18, background: '#FCD116' }} />
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              CENI Cameroun — Élection Présidentielle 2025
            </span>
          </div>
        </header>

        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
