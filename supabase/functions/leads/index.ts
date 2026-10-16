import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req: Request) => {
  // Handle CORS
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

  // GET /api/leads - Get all leads
  if (path === '/api/leads' && req.method === 'GET') {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data, error } = await supabase
      .from('Lead')
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(50)
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // GET /api/leads/:id - Get single lead
  const leadIdMatch = path.match(/^\/api\/leads\/([^\/]+)$/)
  if (leadIdMatch && req.method === 'GET') {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const leadId = leadIdMatch[1]
    
    const { data, error } = await supabase
      .from('Lead')
      .select('*')
      .eq('id', leadId)
      .single()
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // POST /api/leads - Create lead
  if (path === '/api/leads' && req.method === 'POST') {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body = await req.json()
    
    const { data, error } = await supabase
      .from('Lead')
      .insert({
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        email: body.email,
        budget: body.budget,
        source: body.source || 'WEBSITE',
        status: 'NEW',
        temperature: 'COLD',
      })
      .select()
      .single()
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    return new Response(JSON.stringify({ data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response('Not Found', { status: 404 })
})
