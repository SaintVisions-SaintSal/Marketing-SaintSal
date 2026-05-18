import { createClient } from '@/lib/supabase/server'
import SalChat from '@/components/chat/SalChat'

export default async function SalPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // The layout already redirects unauthenticated users, so user is always set here
  if (!user) return null

  return <SalChat user={user} initialAgentId="sal-supreme" />
}
