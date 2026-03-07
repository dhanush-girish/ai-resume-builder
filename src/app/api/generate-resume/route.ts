import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Groq } from 'groq-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ResumeFormData } from '@/types';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, title, raw_data }: { id?: string; title: string; raw_data: ResumeFormData } = body;

        if (!raw_data) {
            return NextResponse.json({ error: 'Missing resume data' }, { status: 400 });
        }

        // Prepare Prompt for Groq
        const prompt = `
You are an expert resume writer and ATS optimizer. Take the following nested JSON representing a user's resume data and format it into a massive, highly professional, ATS-friendly markdown string. 

Focus on:
1. Professional tone
2. Correct ATS keyword placement
3. Action verbs
4. Clean, standard resume sections (Contact, Summary, Experience, Education, Skills)

User Data:
${JSON.stringify(raw_data, null, 2)}

Only output the raw markdown string. Do not include any additional preambles, explanations, or chat. Return the pure markdown.
`;

        // Await Groq completion
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
        });

        const aiContent = chatCompletion.choices[0]?.message?.content || '';

        if (!aiContent) {
            return NextResponse.json({ error: 'AI did not generate any content' }, { status: 500 });
        }

        // Try to save to Supabase
        const resumeId = id || uuidv4();

        try {
            let dbData;
            let dbError;

            if (id) {
                // Update existing resume
                const result = await supabase
                    .from('resumes')
                    .update({
                        title,
                        raw_data,
                        ai_content: aiContent,
                    })
                    .eq('id', id)
                    .select()
                    .single();

                dbData = result.data;
                dbError = result.error;
            } else {
                // Insert new resume
                const result = await supabase
                    .from('resumes')
                    .insert({
                        id: resumeId,
                        title,
                        raw_data,
                        ai_content: aiContent,
                    })
                    .select()
                    .single();

                dbData = result.data;
                dbError = result.error;
            }

            if (dbError) {
                console.error('Database Error:', dbError);
                // DB failed — return AI content without DB reference
                return NextResponse.json({
                    success: true,
                    id: resumeId,
                    ai_content: aiContent,
                    db_saved: false,
                    warning: 'Resume generated but could not be saved. Database may be unavailable.'
                }, { status: 200 });
            }

            // DB succeeded
            return NextResponse.json({
                success: true,
                id: dbData.id,
                data: dbData,
                db_saved: true,
            });
        } catch (dbCatchError: any) {
            console.error('Database connection error:', dbCatchError);
            // Connection-level failure (timeout, etc.)
            return NextResponse.json({
                success: true,
                id: resumeId,
                ai_content: aiContent,
                db_saved: false,
                warning: 'Resume generated but database is unreachable. Showing preview.'
            }, { status: 200 });
        }

    } catch (error: any) {
        console.error('Error generating resume:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
