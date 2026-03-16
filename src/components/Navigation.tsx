'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, LayoutDashboard, PenTool, Menu, X, Briefcase, LogIn, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Navigation() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null);
            }
        );
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: '/create', label: 'Create', icon: PenTool },
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/jobs', label: 'AI Jobs', icon: Briefcase },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-[var(--card-border)] bg-[var(--background)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2.5 group" onClick={() => setMobileMenuOpen(false)}>
                        <div className="relative">
                            <div className="relative bg-[var(--accent-1)] p-2 rounded-lg">
                                <FileText className="h-4 w-4 text-[#1C1C1E]" />
                            </div>
                        </div>
                        <span className="font-bold text-lg text-[var(--text-primary)] tracking-tight">
                            AI Resume <span className="text-[var(--accent-1)]">Maker</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden sm:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${isActive(link.href)
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                        
                        <div className="ml-4 pl-4 border-l border-[var(--card-border)]">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm bg-[var(--accent-1)] text-[#1C1C1E] hover:opacity-90"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Sign In with Google
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="sm:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {mobileMenuOpen && (
                <div className="sm:hidden border-t border-[var(--card-border)] animate-fade-up bg-[var(--background)]">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${isActive(link.href)
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                        
                        <div className="pt-2 mt-2 border-t border-[var(--card-border)]">
                            {user ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        handleLogin();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm bg-[var(--accent-1)] text-[#1C1C1E] hover:opacity-90 mt-2"
                                >
                                    <LogIn className="h-5 w-5" />
                                    Sign In with Google
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
