'use client';

import { Download } from 'lucide-react';

export function SharePageActions() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <button
            onClick={handlePrint}
            className="btn-glow px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm"
        >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export to PDF</span>
            <span className="sm:hidden">PDF</span>
        </button>
    );
}
