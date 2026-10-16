import { supabase } from './supabase'

// Simple data fetching functions that work directly with Supabase
// This bypasses the need for a separate backend API

export async function getLeads() {
  const { data, error } = await supabase
    .from('Lead')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

export async function getProperties() {
  const { data, error } = await supabase
    .from('Property')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

export async function getMessages() {
  const { data, error } = await supabase
    .from('Message')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

export async function getTasks() {
  const { data, error } = await supabase
    .from('Task')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

export async function getNotifications() {
  const { data, error } = await supabase
    .from('Notification')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

export async function getAgencies() {
  const { data, error } = await supabase
    .from('Agency')
    .select('*')

  if (error) throw error
  return data
}

export async function getStats() {
  // Return mock stats for now
  return {
    totalLeads: 150,
    activeLeads: 45,
    qualifiedLeads: 23,
    properties: 32,
    messages: 523,
    conversionRate: 23.5
  }
}
