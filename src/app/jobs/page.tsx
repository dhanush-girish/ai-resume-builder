'use client';

import { useState } from 'react';
import { Briefcase, MapPin, Search, ExternalLink, Building, Loader2 } from 'lucide-react';

export default function JobsPage() {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        setError('');
        setJobs([]);

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, location }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to search jobs');
            }

            setJobs(data.jobs || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
                    AI Job <span className="text-[var(--accent-1)]">Search</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Powered by Firecrawl. Instantly discover job opportunities directly across the web tailored to your role and location.
                </p>
            </div>

            <div className="bg-[#1C1C1E] rounded-2xl p-6 md:p-8 border border-[var(--card-border)] mb-12 shadow-2xl">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Job title, keywords, or company..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-[#2A2A2D] text-white rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)] transition-all border border-transparent focus:border-[var(--accent-1)]"
                        />
                    </div>
                    <div className="flex-1 relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="City, state, remote, or zip code..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-[#2A2A2D] text-white rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)] transition-all border border-transparent focus:border-[var(--accent-1)]"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !query}
                        className="bg-[var(--accent-1)] text-[#1C1C1E] font-bold px-8 py-4 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 md:w-auto min-w-[140px]"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                        {loading ? 'Searching...' : 'Search Jobs'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="space-y-6">
                {!loading && jobs.length > 0 && jobs.map((job, idx) => (
                    <div 
                        key={idx} 
                        className="bg-[#1C1C1E] hover:bg-[#2A2A2D] border border-[var(--card-border)] hover:border-[var(--accent-1)] transition-all p-6 rounded-2xl flex flex-col md:flex-row gap-6 md:items-center group"
                    >
                        <div className="flex-1 space-y-3">
                            <h3 className="text-2xl font-bold text-white group-hover:text-[var(--accent-1)] transition-colors">
                                {job.title}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                                <span className="flex items-center gap-1">
                                    <Building className="h-4 w-4" />
                                    {job.company}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {job.location}
                                </span>
                                {job.salary && (
                                    <span className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                                        {job.salary}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-300 leading-relaxed text-sm line-clamp-3">
                                {job.description}
                            </p>
                        </div>
                        
                        <div className="md:w-48 flex justify-end shrink-0">
                            {job.applyUrl && (
                                <a 
                                    href={job.applyUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full md:w-auto bg-white/5 hover:bg-white/10 border border-[var(--card-border)] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-medium"
                                >
                                    Apply Now
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>
                ))}

                {!loading && jobs.length === 0 && !error && query && (
                    <div className="text-center py-20 bg-[#1C1C1E] rounded-2xl border border-[var(--card-border)]">
                        <Briefcase className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">No jobs found</h3>
                        <p className="text-gray-400">Try adjusting your search terms or location.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
