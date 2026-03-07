import { supabase } from '@/lib/supabase';
import { ResumeViewer } from '@/components/ResumeViewer';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ResumePage({ params }: Props) {
    const { id } = await params;

    let resume = null;
    let fetchError = null;

    try {
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', id)
            .single();

        resume = data;
        fetchError = error;
    } catch (err: any) {
        fetchError = { message: err.message || 'Connection failed' };
    }

    if (fetchError || !resume) {
        console.error('Error fetching resume:', fetchError);
        return (
            <div className="max-w-2xl mx-auto py-20 px-4 text-center">
                <div className="glass-card p-10 animate-fade-up">
                    <div className="relative inline-flex mb-6">
                        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl" />
                        <div className="relative bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center border border-amber-500/20">
                            <AlertTriangle className="h-8 w-8 text-amber-400" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Resume Not Found</h2>
                    <p className="text-gray-400 mb-2 max-w-md mx-auto">
                        This resume couldn&apos;t be loaded. This can happen if:
                    </p>
                    <ul className="text-gray-500 text-sm mb-8 space-y-1">
                        <li>• The database was unavailable when the resume was generated</li>
                        <li>• The resume was deleted</li>
                        <li>• The connection timed out</li>
                    </ul>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-gray-300 border border-white/10 rounded-xl font-semibold hover:bg-white/[0.08] transition-all"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 btn-glow px-6 py-3 rounded-xl font-semibold"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Create New Resume
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Link
                href="/dashboard"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-400 transition-colors mb-6 print:hidden"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </Link>

            <ResumeViewer content={resume.ai_content} resumeId={resume.id} />
        </div>
    );
}
