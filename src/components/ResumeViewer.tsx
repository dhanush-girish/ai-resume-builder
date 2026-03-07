'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Download, Share2, Edit3, Briefcase, Check, Link as LinkIcon } from 'lucide-react';

interface Props {
    content: string;
    resumeId?: string;
}

export function ResumeViewer({ content, resumeId }: Props) {
    const [copied, setCopied] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (!resumeId) return;

        const shareUrl = `${window.location.origin}/share/${resumeId}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback for non-HTTPS environments
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6 print:hidden animate-fade-up">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="relative bg-[var(--accent-1)] p-2 rounded-lg">
                            <Briefcase className="h-5 w-5 text-[#1C1C1E]" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">Your AI Resume</h2>
                        <p className="text-sm text-[var(--text-secondary)]">Optimized for Applicant Tracking Systems</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    {resumeId && (
                        <button
                            onClick={handleShare}
                            className={`px-3 sm:px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium border ${copied
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                                : 'text-gray-400 hover:text-[var(--text-primary)] hover:bg-[var(--surface-1)] border-[var(--card-border)]'
                                }`}
                            title="Copy share link"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span className="hidden sm:inline">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <LinkIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Share Link</span>
                                </>
                            )}
                        </button>
                    )}
                    <button
                        onClick={handlePrint}
                        className="btn-glow px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export to PDF</span>
                    </button>
                </div>
            </div>

            {/* A4 Paper Container */}
            <div className="flex-1 overflow-auto glass-card p-4 sm:p-8 flex justify-center print:bg-white print:border-none print:p-0 print:overflow-visible animate-fade-up-delay-1">
                <div className="bg-white shadow-2xl shadow-black/30 w-full max-w-[850px] min-h-[1100px] p-8 sm:p-12 rounded-lg print:shadow-none print:p-0 print:rounded-none resume-markdown prose prose-slate prose-sm sm:prose-base max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-4xl prose-h1:text-center prose-h1:mb-2 prose-h2:text-xl prose-h2:border-b-2 prose-h2:border-gray-900 prose-h2:uppercase prose-h2:tracking-wider prose-h2:pb-1 prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-lg prose-h3:font-semibold prose-h3:mb-1 prose-h3:mt-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-2 prose-ul:text-gray-700 prose-ul:my-2 prose-li:my-0.5 prose-a:text-gray-900 prose-a:no-underline hover:prose-a:underline marker:text-gray-400">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                    >
                        {content || 'No content found.'}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
