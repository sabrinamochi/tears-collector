import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Lazy-initialize: client is only created when a property is first accessed.
// This prevents build-time errors when env vars are not yet set.
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(_target, prop: string): any {
    return (getClient() as unknown as Record<string, unknown>)[prop];
  },
});
