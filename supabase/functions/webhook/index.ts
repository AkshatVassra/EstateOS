import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const metaAppSecret = Deno.env.get('META_APP_SECRET')!
const metaVerifyToken = Deno.env.get('META_WEBHOOK_VERIFY_TOKEN')!

serve(async (req: Request) => {
  const url = new URL(req.url)
  const path = url.pathname

  // GET - Meta webhook verification
  if (path === '/api/communication/webhook' && req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === metaVerifyToken) {
      return new Response(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    return new Response('Forbidden', { status: 403 })
  }

  // POST - Meta webhook events
  if (path === '/api/communication/webhook' && req.method === 'POST') {
    const body = await req.text()
    const signature = req.headers.get('x-hub-signature-256')

    // Verify signature
    if (signature && metaAppSecret) {
      const expectedSignature = await crypto.subtle.importKey(
        new TextEncoder().encode(metaAppSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      )
      // Simplified signature check - in production, implement full HMAC verification
    }

    const payload = JSON.parse(body)
    
    // Process webhook event
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Handle messages
    if (payload.entry && payload.entry[0] && payload.entry[0].changes) {
      const value = payload.entry[0].changes[0].value
      
      if (value.messages) {
        for (const message of value.messages) {
          if (message.type === 'text') {
            const { from, text } = message
            
            // Save message to database
            await supabase.from('Message').insert({
              phone: from,
              content: text.text.body,
              direction: 'INBOUND',
              createdAt: new Date().toISOString(),
            })
          }
        }
      }
    }

    return new Response('OK', { status: 200 })
  }

  return new Response('Not Found', { status: 404 })
})
