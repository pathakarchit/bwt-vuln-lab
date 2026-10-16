import { createClient } from 'npm:@supabase/supabase-js@2';

// Returns every user profile for the admin page.
Deno.serve(async () => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data, error } = await supabase.from('profiles').select('*');
  return new Response(JSON.stringify(error ?? data), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
});
