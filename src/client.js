import { createClient } from '@supabase/supabase-js';
const URL = 'https://imegnlnalhtaaghyaqoc.supabase.co';
const API_KEY = 'sb_publishable_RUTLudn_0zIrXHug6VXKvA_NRIcxK7I';

export const supabase = createClient(URL, API_KEY);

