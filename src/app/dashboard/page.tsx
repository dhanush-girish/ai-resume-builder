'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardClient } from '@/components/DashboardClient';

export default function DashboardPage() {
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchResumes = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user) {
                setLoading(false);
                return;
            }

            setUser(session.user);

            const { data, error } = await supabase
                .from('resumes')
                .select('id, title, created_at')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching resumes:', error);
            }

            setResumes(data || []);
            setLoading(false);
        };

        fetchResumes();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-24 px-4 text-center">
                <div className="animate-pulse text-gray-400">Loading your resumes...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto py-24 px-4 text-center">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Sign in to view your resumes</h2>
                <p className="text-gray-400">Please sign in with Google to access your dashboard.</p>
            </div>
        );
    }

    return <DashboardClient resumes={resumes} />;
}
