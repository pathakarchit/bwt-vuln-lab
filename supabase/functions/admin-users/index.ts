import { createClient } from 'npm:@supabase/supabase-js@2';

// Returns the profiles the signed-in caller may see (RLS applies). JWT required (verify_jwt = true).
Deno.serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const { data, error } = await supabase.from('profiles').select('*');
  return new Response(JSON.stringify(error ?? data), { headers: { 'Content-Type': 'application/json' } });
});
