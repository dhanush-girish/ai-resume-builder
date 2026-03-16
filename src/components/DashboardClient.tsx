'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Calendar, Sparkles, ArrowRight, Trash2, Copy, Edit2, Briefcase, MapPin, ExternalLink, BookmarkX, Search } from 'lucide-react';
import { ConfirmModal, useToast } from './ConfirmModal';

interface Resume {
    id: string;
    title: string;
    created_at: string;
}

interface SavedJob {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    description: string;
    apply_url: string;
    created_at: string;
}

interface Props {
    resumes: Resume[];
    savedJobs?: SavedJob[];
}

export function DashboardClient({ resumes: initialResumes, savedJobs: initialJobs = [] }: Props) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'resumes' | 'jobs'>('resumes');
    const [resumes, setResumes] = useState<Resume[]>(initialResumes);
    const [savedJobs, setSavedJobs] = useState<SavedJob[]>(initialJobs);
    const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { showToast, ToastComponent } = useToast();

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/delete-resume?id=${deleteTarget.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            setResumes((prev) => prev.filter((r) => r.id !== deleteTarget.id));
            showToast('Resume deleted successfully', 'success');
        } catch {
            showToast('Failed to delete resume. Please try again.', 'error');
        } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
        }
    };

    const handleDuplicate = async (resume: Resume) => {
        showToast('Duplicating resume...', 'info');
        try {
            // Fetch full resume data first
            const res = await fetch(`/api/duplicate-resume?id=${resume.id}`, {
                method: 'POST',
            });

            if (!res.ok) throw new Error('Failed to duplicate');

            const data = await res.json();
            setResumes((prev) => [data.resume, ...prev]);
            showToast('Resume duplicated successfully!', 'success');
        } catch {
            showToast('Failed to duplicate resume.', 'error');
        }
    };

    const handleUnsaveJob = async (id: string) => {
        try {
            const res = await fetch(`/api/unsave-job?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to remove job');

            setSavedJobs(prev => prev.filter(job => job.id !== id));
            showToast('Job removed from saved list', 'success');
        } catch {
            showToast('Failed to remove job. Please try again.', 'error');
        }
    };

    return (
        <>
            {ToastComponent}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Resume"
                message={`Are you sure you want to delete "${deleteTarget?.title || 'this resume'}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                isLoading={isDeleting}
                variant="danger"
            />

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-up">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
                        <p className="text-gray-400 mt-2">Manage your AI-generated resumes and saved jobs.</p>
                    </div>
                    {activeTab === 'resumes' && (
                        <Link
                            href="/create"
                            className="btn-glow px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            Create New
                        </Link>
                    )}
                    {activeTab === 'jobs' && (
                        <Link
                            href="/jobs"
                            className="bg-white/5 border border-[var(--card-border)] hover:bg-white/10 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
                        >
                            <Search className="h-5 w-5" />
                            Find Jobs
                        </Link>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 border-b border-[var(--card-border)] mb-8 animate-fade-up">
                    <button
                        onClick={() => setActiveTab('resumes')}
                        className={`pb-4 px-2 text-sm font-medium transition-all relative ${
                            activeTab === 'resumes' 
                                ? 'text-[var(--accent-1)]' 
                                : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Your Resumes
                        </span>
                        {activeTab === 'resumes' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent-1)]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`pb-4 px-2 text-sm font-medium transition-all relative ${
                            activeTab === 'jobs' 
                                ? 'text-[var(--accent-1)]' 
                                : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Saved Jobs
                        </span>
                        {activeTab === 'jobs' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent-1)]" />
                        )}
                    </button>
                </div>

                {activeTab === 'resumes' && (!resumes || resumes.length === 0) && (
                    <div className="animate-fade-up-delay-1 text-center py-24 glass-card border-dashed">
                        <div className="relative inline-flex mb-6">
                            <div className="relative bg-[var(--accent-1)]/10 w-20 h-20 rounded-full flex items-center justify-center border border-[var(--accent-1)]/20">
                                <FileText className="h-10 w-10 text-[var(--accent-1)]" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No resumes yet</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Get started by creating your first AI-powered resume.</p>
                        <Link
                            href="/create"
                            className="inline-flex px-6 py-3 bg-[var(--surface-1)] text-[var(--accent-1)] border border-[var(--accent-1)]/20 rounded-xl font-semibold hover:bg-[var(--accent-1)]/10 hover:border-[var(--accent-1)]/30 transition-all items-center gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            Create Resume
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
                
                {activeTab === 'resumes' && resumes && resumes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up-delay-1">
                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="glass-card p-6 group cursor-pointer relative"
                            >
                                {/* Action buttons */}
                                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Link
                                        href={`/edit/${resume.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-2 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                                        title="Edit Resume"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDuplicate(resume);
                                        }}
                                        className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                        title="Duplicate Resume"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteTarget(resume);
                                        }}
                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        title="Delete Resume"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <Link href={`/dashboard/${resume.id}`} className="block">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="relative">
                                            <div className="relative bg-[var(--surface-2)] p-3 rounded-xl group-hover:bg-[var(--accent-1)] transition-all border border-[var(--card-border)] group-hover:border-transparent">
                                                <FileText className="h-6 w-6 text-[var(--accent-1)] group-hover:text-[#1C1C1E] transition-colors" />
                                            </div>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-[var(--accent-1)] transition-all group-hover:translate-x-1 mt-2" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 truncate group-hover:text-[var(--accent-1)] transition-colors pr-16">
                                        {resume.title || 'Untitled Resume'}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {new Date(resume.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'jobs' && (!savedJobs || savedJobs.length === 0) && (
                        <div className="animate-fade-up-delay-1 text-center py-24 glass-card border-dashed">
                            <div className="relative inline-flex mb-6">
                                <div className="relative bg-[var(--accent-1)]/10 w-20 h-20 rounded-full flex items-center justify-center border border-[var(--accent-1)]/20">
                                    <Briefcase className="h-10 w-10 text-[var(--accent-1)]" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No saved jobs</h3>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't saved any job opportunities yet. Head over to the AI Job Search to find some.</p>
                            <Link
                                href="/jobs"
                                className="inline-flex px-6 py-3 bg-[var(--surface-1)] text-[var(--accent-1)] border border-[var(--accent-1)]/20 rounded-xl font-semibold hover:bg-[var(--accent-1)]/10 hover:border-[var(--accent-1)]/30 transition-all items-center gap-2"
                            >
                                <Search className="h-4 w-4" />
                                Search Jobs
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                )}
                
                {activeTab === 'jobs' && savedJobs && savedJobs.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up-delay-1">
                            {savedJobs.map((job) => (
                                <div key={job.id} className="glass-card p-6 flex flex-col justify-between group">
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-white group-hover:text-[var(--accent-1)] transition-colors line-clamp-2">
                                                {job.title}
                                            </h3>
                                            <button 
                                                onClick={() => handleUnsaveJob(job.id)}
                                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0 ml-4"
                                                title="Remove saved job"
                                            >
                                                <BookmarkX className="h-5 w-5" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-3 text-gray-400 text-sm">
                                            <span className="flex items-center gap-1.5 font-medium text-gray-300">
                                                <Briefcase className="h-4 w-4" />
                                                {job.company}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4" />
                                                {job.location}
                                            </span>
                                            {job.salary && (
                                                <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                                                    {job.salary}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                            {job.description}
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-[var(--card-border)] flex items-center justify-between">
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Saved on {new Date(job.created_at).toLocaleDateString()}
                                        </div>
                                        <a 
                                            href={job.apply_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="bg-white/5 hover:bg-white/10 border border-[var(--card-border)] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium text-sm"
                                        >
                                            Apply Now
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                )}
            </div>
        </>
    );
}
