import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntykgubqbhlgxaonfiba.supabase.co';
const supabaseKey = 'sb_publishable_9_yYKixODKsLML8ymDsR_w_R9lDQfRl';

export const supabase = createClient(supabaseUrl, supabaseKey);