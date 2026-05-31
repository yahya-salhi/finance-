import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hkgkouamdfmtdfksmbco.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_quOZc5-znJ5gFXlGURT1SA__58KjKSn';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
