'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ContactStep } from './form-steps/ContactStep';
import { ExperienceStep } from './form-steps/ExperienceStep';
import { EducationStep } from './form-steps/EducationStep';
import { ProjectsStep } from './form-steps/ProjectsStep';
import { SummarySkillsStep } from './form-steps/SummarySkillsStep';
import { ResumeFormData } from '@/types';
import { Toast, ToastType } from './Toast';
import { ResumeViewer } from './ResumeViewer';
import { supabase } from '@/lib/supabase';

const steps = [
    { id: 'contact', title: 'Personal Info' },
    { id: 'experience', title: 'Experience' },
    { id: 'education', title: 'Education' },
    { id: 'projects', title: 'Projects' },
    { id: 'skills', title: 'Summary & Skills' },
];

const initialData: ResumeFormData = {
    contactInfo: { fullName: '', email: '', phone: '', location: '' },
    experience: [],
    education: [],
    projects: [],
    summary: '',
    skills: [],
};

// Validation functions per step
function validateContact(data: ResumeFormData['contactInfo']): string[] {
    const errors: string[] = [];
    if (!data.fullName.trim()) errors.push('Full name is required');
    if (!data.email.trim()) errors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Please enter a valid email address');
    if (!data.phone.trim()) errors.push('Phone number is required');
    if (!data.location.trim()) errors.push('Location is required');
    return errors;
}

function validateExperience(data: ResumeFormData['experience']): string[] {
    const errors: string[] = [];
    data.forEach((exp, i) => {
        if (!exp.company.trim()) errors.push(`Experience ${i + 1}: Company name is required`);
        if (!exp.role.trim()) errors.push(`Experience ${i + 1}: Role/title is required`);
        if (!exp.startDate) errors.push(`Experience ${i + 1}: Start date is required`);
        if (!exp.current && !exp.endDate) errors.push(`Experience ${i + 1}: End date is required (or mark as current)`);
    });
    return errors;
}

function validateEducation(data: ResumeFormData['education']): string[] {
    const errors: string[] = [];
    data.forEach((edu, i) => {
        if (!edu.school.trim()) errors.push(`Education ${i + 1}: School name is required`);
        if (!edu.degree.trim()) errors.push(`Education ${i + 1}: Degree is required`);
    });
    return errors;
}

function validateProjects(data: ResumeFormData['projects']): string[] {
    const errors: string[] = [];
    data.forEach((proj, i) => {
        if (!proj.name.trim()) errors.push(`Project ${i + 1}: Name is required`);
        if (!proj.description.trim()) errors.push(`Project ${i + 1}: Description is required`);
    });
    return errors;
}

function validateSummarySkills(data: ResumeFormData): string[] {
    const errors: string[] = [];
    if (!data.summary.trim()) errors.push('Professional summary is required');
    if (data.skills.length === 0) errors.push('Add at least one skill');
    return errors;
}

export function ResumeForm({ initialData: providedData, resumeId }: { initialData?: ResumeFormData, resumeId?: string }) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<ResumeFormData>(providedData || initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
        message: '', type: 'info', visible: false,
    });
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserId(session?.user?.id || null);
        });
    }, []);

    const updateData = (stepData: Partial<ResumeFormData>) => {
        setFormData((prev) => ({ ...prev, ...stepData }));
        if (validationErrors.length > 0) setValidationErrors([]);
    };

    const validateCurrentStep = (): boolean => {
        let errors: string[] = [];
        switch (currentStep) {
            case 0:
                errors = validateContact(formData.contactInfo);
                break;
            case 1:
                errors = validateExperience(formData.experience);
                break;
            case 2:
                errors = validateEducation(formData.education);
                break;
            case 3:
                errors = validateProjects(formData.projects);
                break;
            case 4:
                errors = validateSummarySkills(formData);
                break;
        }
        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handlenext = () => {
        if (!validateCurrentStep()) {
            setToast({ message: 'Please fix the errors below', type: 'warning', visible: true });
            return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
            setValidationErrors([]);
        } else {
            submitForm();
        }
    };

    const handleback = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
            setValidationErrors([]);
        }
    };

    const submitForm = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: resumeId,
                    title: `${formData.contactInfo.fullName}'s Resume`,
                    raw_data: formData,
                    user_id: userId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate resume');
            }

            const data = await response.json();

            // If saved to DB successfully, redirect to view page
            if (data.db_saved && data.data?.id) {
                setToast({ message: 'Resume generated successfully! Redirecting...', type: 'success', visible: true });
                setTimeout(() => {
                    router.push(`/dashboard/${data.data.id}`);
                }, 1000);
            } else if (data.ai_content) {
                // DB save failed but AI generated content — show it inline
                setGeneratedContent(data.ai_content);
                setToast({
                    message: data.warning || 'Resume generated! (Database save failed — showing preview below)',
                    type: 'warning',
                    visible: true,
                });
            } else {
                throw new Error('No content was generated');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
            setToast({ message: 'Failed to generate resume. Please try again.', type: 'error', visible: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = ((currentStep) / (steps.length - 1)) * 100;

    // If we have generated content (DB save failed fallback), show the resume viewer
    if (generatedContent) {
        return (
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.visible}
                    onClose={() => setToast(prev => ({ ...prev, visible: false }))}
                />
                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl backdrop-blur-sm animate-fade-up">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                        <span className="text-amber-300 font-semibold text-sm">Database Unavailable</span>
                    </div>
                    <p className="text-amber-400/80 text-sm">
                        Your resume was generated successfully but couldn&apos;t be saved to the database. You can still view and print it below. Try again later to save it.
                    </p>
                </div>
                <ResumeViewer content={generatedContent} />
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            {/* Step Indicator */}
            <div className="mb-12">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[var(--card-border)] z-0" />
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--accent-1)] z-0 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />

                    {steps.map((step, index) => {
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-sm font-bold ${isActive
                                    ? 'bg-[var(--accent-1)] text-[#1C1C1E] scale-110'
                                    : isCompleted
                                        ? 'bg-[var(--accent-1)]/20 border-2 border-[var(--accent-1)] text-[var(--accent-1)]'
                                        : 'bg-[var(--surface-1)] border border-[var(--card-border)] text-[var(--text-secondary)]'
                                    }`}>
                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                                </div>
                                <span className={`absolute -bottom-7 text-xs font-semibold whitespace-nowrap transition-colors hidden sm:block ${isActive || isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Validation Errors */}
            <AnimatePresence>
                {validationErrors.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                                <span className="text-amber-300 font-semibold text-sm">Please fix the following:</span>
                            </div>
                            <ul className="space-y-1 ml-6">
                                {validationErrors.map((err, i) => (
                                    <li key={i} className="text-amber-400/80 text-sm list-disc">{err}</li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl backdrop-blur-sm">
                    {error}
                </div>
            )}

            {/* Form Content */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {currentStep === 0 && <ContactStep data={formData.contactInfo} updateData={(d) => updateData({ contactInfo: { ...formData.contactInfo, ...d } })} />}
                        {currentStep === 1 && <ExperienceStep data={formData.experience} updateData={(d) => updateData({ experience: d })} />}
                        {currentStep === 2 && <EducationStep data={formData.education} updateData={(d) => updateData({ education: d })} />}
                        {currentStep === 3 && <ProjectsStep data={formData.projects} updateData={(d) => updateData({ projects: d })} />}
                        {currentStep === 4 && <SummarySkillsStep data={formData} updateData={updateData} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <button
                    onClick={handleback}
                    disabled={currentStep === 0 || isSubmitting}
                    className={`px-4 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all ${currentStep === 0
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </button>
                <button
                    onClick={handlenext}
                    disabled={isSubmitting}
                    className="btn-glow px-4 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="hidden sm:inline">{resumeId ? 'Updating...' : 'Generating...'}</span>
                            <span className="sm:hidden">Wait...</span>
                        </>
                    ) : currentStep === steps.length - 1 ? (
                        <>
                            <span className="hidden sm:inline">{resumeId ? 'Update Resume' : 'Generate Resume'}</span>
                            <span className="sm:hidden">{resumeId ? 'Update' : 'Generate'}</span>
                            <Sparkles className="w-4 h-4 ml-1" />
                        </>
                    ) : (
                        <>
                            <span className="hidden sm:inline">Next Step</span>
                            <span className="sm:hidden">Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
