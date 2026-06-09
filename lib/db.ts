import { supabaseAdmin } from './supabase';

export async function query(sql: string, params?: any[]) {
  const { data, error } = await supabaseAdmin.rpc('execute_sql', {
    query_text: sql,
    query_params: params || []
  });
  if (error) throw error;
  return data;
}