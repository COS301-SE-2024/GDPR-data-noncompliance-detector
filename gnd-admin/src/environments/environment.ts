const supabaseUrl: string | undefined = process.env['SUPABASE_URL'];
const supabaseKey: string | undefined = process.env['SUPABASE_KEY'];

const url: string = supabaseUrl ?? 'defaultSupabaseUrl';
const key: string = supabaseKey ?? 'defaultSupabaseKey';

export const environment = {
  production: true,
  supabaseUrl:url,
  supabaseKey: key,
};

