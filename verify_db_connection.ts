require('dotenv').config({ path: './.env.local' });
import { testSupabaseConnection } from './lib/supabase';

async function main() {
  const result = await testSupabaseConnection();
  console.log(result);
}

main();
