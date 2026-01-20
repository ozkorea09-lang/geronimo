import { createClient } from '@supabase/supabase-js';

// Vercel 설정에서 불러올 환경 변수 이름으로 변경합니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 두 값이 없을 경우를 대비한 체크
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL 또는 Key가 설정되지 않았습니다. Vercel 환경 변수를 확인하세요.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');