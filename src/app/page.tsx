import Link from 'next/link';
import { ArrowRight, Sparkles, FileCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-12 sm:pt-20 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-4xl mx-auto relative z-10">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--text-secondary)]/20 bg-[var(--surface-1)] text-[var(--accent-1)] font-medium text-sm mb-6 sm:mb-8">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Resume Generation</span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up-delay-1 text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-5 sm:mb-6 leading-[1.1] text-[var(--text-primary)]">
            Craft your perfect <br />
            ATS-friendly resume in <span className="text-[var(--accent-1)]">minutes</span>.
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up-delay-2 text-base sm:text-lg md:text-xl text-[var(--text-secondary)] mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto px-2">
            Input your details and let our AI summarize, format, and optimize your resume to stand out to recruiters and pass ATS systems with ease.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/create"
              className="btn-glow px-8 py-4 rounded-xl font-semibold text-base sm:text-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Build My Resume
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-[var(--surface-1)] text-[var(--text-primary)] border border-[var(--card-border)] rounded-xl font-semibold text-base sm:text-lg hover:bg-[var(--surface-2)] transition-all w-full sm:w-auto justify-center flex items-center"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass-card p-6 sm:p-8 group">
            <div className="h-12 w-12 rounded-xl bg-[var(--accent-1)]/10 flex items-center justify-center text-[var(--accent-1)] mb-5 sm:mb-6 group-hover:scale-105 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Lightning Fast</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">Fill out our multi-step form and generate a comprehensive resume instantly with the help of powerful AI models.</p>
          </div>

          <div className="glass-card p-6 sm:p-8 group">
            <div className="h-12 w-12 rounded-xl bg-[var(--accent-1)]/10 flex items-center justify-center text-[var(--accent-1)] mb-5 sm:mb-6 group-hover:scale-105 transition-transform">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">ATS-Optimized</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">The AI ensures your resume uses the right keywords and structure to pass Applicant Tracking Systems.</p>
          </div>

          <div className="glass-card p-6 sm:p-8 group sm:col-span-2 md:col-span-1">
            <div className="h-12 w-12 rounded-xl bg-[var(--accent-1)]/10 flex items-center justify-center text-[var(--accent-1)] mb-5 sm:mb-6 group-hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Beautiful Exports</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">View your beautiful new resume right in the browser and effortlessly print to PDF with clean styling.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full border-t border-white/[0.06] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1">100%</div>
              <div className="text-xs sm:text-sm text-[var(--text-secondary)]">ATS Compatible</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1">&lt; 30s</div>
              <div className="text-xs sm:text-sm text-[var(--text-secondary)]">Generation Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1">AI</div>
              <div className="text-xs sm:text-sm text-[var(--text-secondary)]">Powered by Groq</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1">Free</div>
              <div className="text-xs sm:text-sm text-[var(--text-secondary)]">No Cost to Use</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
