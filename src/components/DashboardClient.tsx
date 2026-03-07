'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Calendar, Sparkles, ArrowRight, Trash2, Copy, Edit2 } from 'lucide-react';
import { ConfirmModal, useToast } from './ConfirmModal';

interface Resume {
    id: string;
    title: string;
    created_at: string;
}

interface Props {
    resumes: Resume[];
}

export function DashboardClient({ resumes: initialResumes }: Props) {
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>(initialResumes);
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 animate-fade-up">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Your Resumes</h1>
                        <p className="text-gray-400 mt-2">Manage and view all your AI-generated resumes.</p>
                    </div>
                    <Link
                        href="/create"
                        className="btn-glow px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Create New
                    </Link>
                </div>

                {!resumes || resumes.length === 0 ? (
                    <div className="animate-fade-up-delay-1 text-center py-24 glass-card border-dashed">
                        <div className="relative inline-flex mb-6">
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl" />
                            <div className="relative bg-indigo-500/10 w-20 h-20 rounded-full flex items-center justify-center border border-indigo-500/20">
                                <FileText className="h-10 w-10 text-indigo-400" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No resumes yet</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Get started by creating your first AI-powered resume.</p>
                        <Link
                            href="/create"
                            className="inline-flex px-6 py-3 bg-white/5 text-indigo-300 border border-indigo-500/20 rounded-xl font-semibold hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all items-center gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            Create Resume
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
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
                                            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/20 rounded-xl blur-md transition-all" />
                                            <div className="relative bg-indigo-500/10 p-3 rounded-xl group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 transition-all border border-indigo-500/20 group-hover:border-transparent">
                                                <FileText className="h-6 w-6 text-indigo-400 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-indigo-400 transition-all group-hover:translate-x-1 mt-2" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-indigo-300 transition-colors pr-16">
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
            </div>
        </>
    );
}
