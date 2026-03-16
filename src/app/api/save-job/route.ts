import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { job, user_id } = body;

        if (!job || !user_id) {
            return NextResponse.json({ error: 'Missing job or user ID' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('saved_jobs')
            .insert({
                user_id,
                title: job.title,
                company: job.company,
                location: job.location,
                salary: job.salary || null,
                description: job.description,
                apply_url: job.applyUrl || job.apply_url,
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving job:', error);
            return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
        }

        return NextResponse.json({ success: true, savedJob: data });
    } catch (error: any) {
        console.error('Error saving job:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
