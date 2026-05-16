'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_TABS = [
  { label: 'SAL', href: '/sal' },
  { label: 'Inbox', href: '/inbox' },
  { label: 'Studio', href: '/studio' },
  { label: 'Listen', href: '/listen' },
  { label: 'Launch', href: '/launch' },
  { label: 'Team', href: '/team' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        backgroundColor: '#141414',
        borderBottom: '1px solid #2A2A2A',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '20px',
        paddingRight: '20px',
        position: 'sticky',
        top: '93px',
        zIndex: 48,
        overflowX: 'auto',
      }}
    >
      {NAV_TABS.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 16px',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#D4AF37' : '#8A8A85',
              textDecoration: 'none',
              borderBottom: isActive ? '2px solid #D4AF37' : '2px solid transparent',
              whiteSpace: 'nowrap',
              letterSpacing: '0.02em',
              transition: 'color 0.15s',
              marginBottom: isActive ? '-1px' : '-1px',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLAnchorElement).style.color = '#D4AF37'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLAnchorElement).style.color = '#8A8A85'
              }
            }}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
