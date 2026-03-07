'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const styles = {
    success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    error: 'bg-red-500/15 border-red-500/30 text-red-300',
    warning: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    info: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
};

const iconStyles = {
    success: 'text-emerald-400',
    error: 'text-red-400',
    warning: 'text-amber-400',
    info: 'text-blue-400',
};

export function Toast({ message, type, isVisible, onClose, duration = 4000 }: ToastProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            // Small delay for enter animation
            requestAnimationFrame(() => setShow(true));
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onClose, 300);
            }, duration);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const Icon = icons[type];

    return (
        <div className="fixed top-20 right-4 z-[100]">
            <div
                className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 max-w-sm ${styles[type]} ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    }`}
            >
                <Icon className={`h-5 w-5 flex-shrink-0 ${iconStyles[type]}`} />
                <p className="text-sm font-medium flex-1">{message}</p>
                <button
                    onClick={() => {
                        setShow(false);
                        setTimeout(onClose, 300);
                    }}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
