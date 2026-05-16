import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/shared/Header'
import Nav from '@/components/shared/Nav'
import Footer from '@/components/shared/Footer'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
      }}
    >
      <Header user={user} />
      <Nav />
      <main
        style={{
          flex: 1,
          padding: '24px 20px',
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
