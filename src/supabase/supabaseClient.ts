import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jkljllpoxijewhfijwkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGpsbHBveGlqZXdoZmlqd2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MzA4NTYsImV4cCI6MjA1NzEwNjg1Nn0._pEki3nxnfAa92mSeC_E0QZ8pqe5ijCbWWao-TSA9Rg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
