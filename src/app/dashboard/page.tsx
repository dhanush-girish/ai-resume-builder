import { supabase } from '@/lib/supabase';
import { DashboardClient } from '@/components/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const { data: resumes, error } = await supabase
        .from('resumes')
        .select('id, title, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching resumes:', error);
    }

    return <DashboardClient resumes={resumes || []} />;
}
