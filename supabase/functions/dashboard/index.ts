import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, content-type',
      },
    })
  }

  const url = new URL(req.url)
  const path = url.pathname

  // GET /api/dashboard
  if (path === '/api/dashboard' && req.method === 'GET') {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get stats
    const [{ count: totalLeads }] = await supabase.from('Lead').select('*', { count: 'exact', head: true })
    const [{ count: totalProperties }] = await supabase.from('Property').select('*', { count: 'exact', head: true })
    const [{ count: totalMessages }] = await supabase.from('Message').select('*', { count: 'exact', head: true })
    
    const data = {
      overview: {
        revenue: 1250000,
        leads: totalLeads || 0,
        conversions: Math.floor((totalLeads || 0) * 0.23),
      },
      activity: [
        { type: 'lead', message: 'New lead activity', time: '2 hours ago' },
        { type: 'message', message: 'Message activity', time: '3 hours ago' },
      ]
    }
    
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response('Not Found', { status: 404 })
})
