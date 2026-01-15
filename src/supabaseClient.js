import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xqelbfpgfmvqijgojszk.supabase.co';          // ← kopeeri Project URL alt
const supabaseKey = 'sb_publishable_qk8WuaN1x4EqzNacL5_J3w_7aDW2paF';   // ← kopeeri Publishable key alt

export const supabase = createClient(supabaseUrl, supabaseKey);