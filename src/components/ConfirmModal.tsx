'use client';

import { useState } from 'react';
import { Toast, ToastType } from './Toast';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    variant?: 'danger' | 'default';
}

export function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    isLoading = false,
    variant = 'default',
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={!isLoading ? onCancel : undefined}
            />
            {/* Modal */}
            <div className="relative glass-card p-6 max-w-md w-full animate-fade-up shadow-2xl shadow-black/50">
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 ${variant === 'danger'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                            : 'btn-glow'
                            }`}
                    >
                        {isLoading && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Custom hook for toast management
export function useToast() {
    const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
        message: '',
        type: 'info',
        visible: false,
    });

    const showToast = (message: string, type: ToastType = 'info') => {
        setToast({ message, type, visible: true });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, visible: false }));
    };

    const ToastComponent = (
        <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.visible}
            onClose={hideToast}
        />
    );

    return { showToast, hideToast, ToastComponent };
}
