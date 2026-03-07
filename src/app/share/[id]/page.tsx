import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';
import { FileText, Sparkles, Calendar } from 'lucide-react';
import { SharePageActions } from '@/components/SharePageActions';

interface Props {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
    const { id } = await params;

    try {
        const { data: resume } = await supabase
            .from('resumes')
            .select('title')
            .eq('id', id)
            .single();

        return {
            title: resume?.title
                ? `${resume.title} — AI Resume Maker`
                : 'Shared Resume — AI Resume Maker',
            description: 'View this AI-generated, ATS-optimized resume.',
        };
    } catch {
        return {
            title: 'Shared Resume — AI Resume Maker',
            description: 'View this AI-generated, ATS-optimized resume.',
        };
    }
}

export default async function SharePage({ params }: Props) {
    const { id } = await params;

    let resume = null;

    try {
        const { data, error } = await supabase
            .from('resumes')
            .select('id, title, ai_content, created_at')
            .eq('id', id)
            .single();

        if (!error) resume = data;
    } catch {
        // Connection error
    }

    if (!resume) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="glass-card p-10 text-center max-w-md animate-fade-up">
                    <div className="relative inline-flex mb-6">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
                        <div className="relative bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center border border-red-500/20">
                            <FileText className="h-8 w-8 text-red-400" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Resume Not Available</h2>
                    <p className="text-gray-400 mb-8">
                        This resume doesn&apos;t exist or the link has expired. The owner may have deleted it.
                    </p>
                    <Link
                        href="/create"
                        className="btn-glow px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
                    >
                        <Sparkles className="h-4 w-4" />
                        Create Your Own Resume
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 print:hidden animate-fade-up">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">{resume.title || 'Resume'}</h1>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        Created {new Date(resume.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </div>
                </div>
                <SharePageActions />
            </div>

            {/* A4 Paper Container */}
            <div className="glass-card p-4 sm:p-8 flex justify-center print:bg-white print:border-none print:p-0 print:overflow-visible animate-fade-up-delay-1">
                <div className="bg-white shadow-2xl shadow-black/30 w-full max-w-[850px] min-h-[1100px] p-8 sm:p-12 rounded-lg print:shadow-none print:p-0 print:rounded-none resume-markdown prose prose-slate prose-sm sm:prose-base max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-4xl prose-h1:text-center prose-h1:mb-2 prose-h2:text-xl prose-h2:border-b-2 prose-h2:border-gray-900 prose-h2:uppercase prose-h2:tracking-wider prose-h2:pb-1 prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-lg prose-h3:font-semibold prose-h3:mb-1 prose-h3:mt-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-2 prose-ul:text-gray-700 prose-ul:my-2 prose-li:my-0.5 prose-a:text-gray-900 prose-a:no-underline hover:prose-a:underline marker:text-gray-400">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                    >
                        {resume.ai_content || 'No content found.'}
                    </ReactMarkdown>
                </div>
            </div>

            {/* CTA banner */}
            <div className="print:hidden mt-8 text-center py-8 glass-card animate-fade-up-delay-2">
                <p className="text-gray-400 text-sm mb-4">Impressed? Create your own AI-powered resume in minutes</p>
                <Link
                    href="/create"
                    className="btn-glow px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
                >
                    <Sparkles className="h-4 w-4" />
                    Build My Resume
                </Link>
            </div>
        </div>
    );
}
