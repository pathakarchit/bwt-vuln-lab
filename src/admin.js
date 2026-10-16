import { supabase } from './supabase.js';

// "All users" page: calls the Edge Function with the signed-in user's token. No secret key in the browser.
export async function listAllUsers() {
  const { data, error } = await supabase.functions.invoke('admin-users');
  if (error) throw error;
  return data;
}
