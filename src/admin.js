import { createClient } from '@supabase/supabase-js';

// Admin client for the "All users" page.
const SUPABASE_URL = 'https://mqdhisrirpesywdzoosj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xZGhpc3JpcnBlc3l3ZHpvb3NqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjEzMDAwMCwiZXhwIjoyMTA3NzA2MDAwfQ.y50fi2QyAdAhSNR6Vs1am6v4AO8BG2A27UxT0ulx708';

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function listAllUsers() {
  const { data, error } = await supabaseAdmin.from('profiles').select('*');
  if (error) throw error;
  return data;
}
