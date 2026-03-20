import { supabase } from './supabase'

export async function saveMealLog(payload) {
  const { data, error } = await supabase
    .from('meal_logs')
    .insert([payload])
    .select()

  if (error) {
    throw error
  }

  return data?.[0]
}