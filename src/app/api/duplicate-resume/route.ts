import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing resume ID' }, { status: 400 });
        }

        // Fetch original resume
        const { data: original, error: fetchError } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !original) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        // Create duplicate
        const newId = uuidv4();
        const { data: duplicate, error: insertError } = await supabase
            .from('resumes')
            .insert({
                id: newId,
                title: `${original.title} (Copy)`,
                raw_data: original.raw_data,
                ai_content: original.ai_content,
                user_id: original.user_id,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Duplicate error:', insertError);
            return NextResponse.json({ error: 'Failed to duplicate resume' }, { status: 500 });
        }

        return NextResponse.json({ success: true, resume: duplicate });
    } catch (error: any) {
        console.error('Error duplicating resume:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
