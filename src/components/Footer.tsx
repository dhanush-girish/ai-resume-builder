import Link from 'next/link';
import { FileText, Github, Twitter, Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-white/[0.06] py-12 mt-auto print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center space-x-2.5 mb-4 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-lg blur-md" />
                                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                                    <FileText className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <span className="font-bold text-lg text-white tracking-tight">
                                AI Resume <span className="gradient-text">Maker</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Build professional, ATS-ready resumes in minutes with the power of AI.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/create" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Create Resume</Link></li>
                            <li><Link href="/dashboard" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Features</h4>
                        <ul className="space-y-2.5">
                            <li><span className="text-sm text-gray-500">ATS Optimization</span></li>
                            <li><span className="text-sm text-gray-500">AI-Powered Writing</span></li>
                            <li><span className="text-sm text-gray-500">PDF Export</span></li>
                        </ul>
                    </div>

                    {/* Tech */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Built With</h4>
                        <ul className="space-y-2.5">
                            <li><span className="text-sm text-gray-500">Next.js 16</span></li>
                            <li><span className="text-sm text-gray-500">Groq AI (Llama 3.3)</span></li>
                            <li><span className="text-sm text-gray-500">Supabase</span></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        © {new Date().getFullYear()} AI Resume Maker. Made with
                        <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400 inline mx-0.5" />
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-gray-600 hover:text-white transition-colors" aria-label="GitHub">
                            <Github className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-white transition-colors" aria-label="Twitter">
                            <Twitter className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
