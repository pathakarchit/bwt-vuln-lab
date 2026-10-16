import { createClient } from '@supabase/supabase-js';

// Public (anon) key: safe in the browser when RLS is set up. (Dummy value in this public lab.)
const SUPABASE_URL = 'https://mqdhisrirpesywdzoosj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xZGhpc3JpcnBlc3l3ZHpvb3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzAwMDAsImV4cCI6MjEwNzcwNjAwMH0.UeAfSVMM57krjeUsYkhEez8JMACIuShs7DkdIe0rOtI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
