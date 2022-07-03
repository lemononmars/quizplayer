import { createClient } from '@supabase/supabase-js';

type SupaStorageBucket = 'avatars' | 'images' ;
const DIR_IMAGE = 'https://ojjggolcfmjnovmipaav.supabase.in/storage/v1/object/public/images/';
const DEFAULT_IMAGE_FILE = 'default.jpg';

export const supabaseClient = createClient(
	String(import.meta.env.VITE_SUPABASE_URL),
	String(import.meta.env.VITE_SUPABASE_ANON_KEY)
);

/**
 * Convenience re-exports for typed selections
 *
 */
// export const auth = supabaseClient.auth;
export const storage = supabaseClient.storage;

/**
 *
 * @param table The Supabase table to act upon
 * @returns {data, error}
 */
export const from = (table: string) => supabaseClient.from(table);
/**
 *
 * @param bucket The Supabase storage bucket to act upon
 * @returns
 */
export const fromBucket = (bucket: SupaStorageBucket) => supabaseClient.storage.from(bucket);