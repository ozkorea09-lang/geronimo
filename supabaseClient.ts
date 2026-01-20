import { createClient } from '@supabase/supabase-js';

// 1. 본인의 Supabase 주소 (https://...supabase.co)
// 2. 본인의 anon public 키 (ey...)
// 이 두 정보는 Supabase 설정(Settings > API)에서 찾을 수 있습니다.

const supabaseUrl = 'YOUR_SUPABASE_URL'; 
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);