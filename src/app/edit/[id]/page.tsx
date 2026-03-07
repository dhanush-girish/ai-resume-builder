import { supabase } from '@/lib/supabase';
import { ResumeForm } from '@/components/ResumeForm';
import { Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch existing resume data
    const { data: resume, error } = await supabase
        .from('resumes')
        .select('raw_data')
        .eq('id', id)
        .single();

    if (error || !resume) {
        console.error('Error fetching resume to edit:', error);
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 animate-fade-up">
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-lg blur-md" />
                        <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Edit Resume</h1>
                </div>
                <p className="text-gray-400 ml-[3.25rem]">Update your details below. Our AI will regenerate an updated, optimized version.</p>
            </div>

            <div className="glass-card animate-fade-up-delay-1">
                <ResumeForm initialData={resume.raw_data} resumeId={id} />
            </div>
        </div>
    );
}
