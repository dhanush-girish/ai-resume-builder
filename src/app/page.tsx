import Link from 'next/link';
import { ArrowRight, Sparkles, FileCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-12 sm:pt-20 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        {/* Floating orbs */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />

        <div className="text-center max-w-4xl mx-auto relative z-10">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 font-medium text-sm mb-6 sm:mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Resume Generation</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up-delay-1 text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-5 sm:mb-6 leading-[1.1]">
            <span className="text-white">Craft your perfect</span>
            <br />
            <span className="text-white">ATS-friendly resume in </span>
            <span className="gradient-text">minutes</span>
            <span className="text-white">.</span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up-delay-2 text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto px-2">
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
              className="px-8 py-4 bg-white/[0.05] text-gray-300 border border-white/10 rounded-xl font-semibold text-base sm:text-lg hover:bg-white/[0.08] hover:border-white/20 transition-all w-full sm:w-auto justify-center flex items-center backdrop-blur-sm"
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
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
            <p className="text-gray-400 leading-relaxed">Fill out our multi-step form and generate a comprehensive resume instantly with the help of powerful AI models.</p>
          </div>

          <div className="glass-card p-6 sm:p-8 group">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">ATS-Optimized</h3>
            <p className="text-gray-400 leading-relaxed">The AI ensures your resume uses the right keywords and structure to pass Applicant Tracking Systems.</p>
          </div>

          <div className="glass-card p-6 sm:p-8 group sm:col-span-2 md:col-span-1">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Beautiful Exports</h3>
            <p className="text-gray-400 leading-relaxed">View your beautiful new resume right in the browser and effortlessly print to PDF with clean styling.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full border-t border-white/[0.06] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">100%</div>
              <div className="text-xs sm:text-sm text-gray-500">ATS Compatible</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">&lt; 30s</div>
              <div className="text-xs sm:text-sm text-gray-500">Generation Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">AI</div>
              <div className="text-xs sm:text-sm text-gray-500">Powered by Groq</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">Free</div>
              <div className="text-xs sm:text-sm text-gray-500">No Cost to Use</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
