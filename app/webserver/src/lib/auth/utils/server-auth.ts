'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getAuthenticatedUserId(): Promise<string | null> {
    const cookieStore = cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
} 