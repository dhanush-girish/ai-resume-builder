import { ResumeFormData } from '@/types';
import { Sparkles, Code, PenTool } from 'lucide-react';

interface Props {
    data: ResumeFormData;
    updateData: (data: Partial<ResumeFormData>) => void;
}

export function SummarySkillsStep({ data, updateData }: Props) {
    const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        updateData({ skills: skillsArray });
    };

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-xl border border-indigo-500/20 flex gap-4 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl h-fit shadow-lg shadow-indigo-500/20">
                    <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-white text-lg">Almost there!</h3>
                    <p className="text-gray-400 mt-1 leading-relaxed">
                        Provide a brief professional summary and a list of your core skills. Our AI will weave these into a compelling narrative and format your resume for ATS systems.
                    </p>
                </div>
            </div>

            <div>
                <label className="form-label flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-gray-500" />
                    Professional Summary
                </label>
                <div className="mt-2">
                    <textarea
                        rows={5}
                        className="form-textarea"
                        placeholder="Passionate full-stack developer with 5+ years of experience building scalable web applications. Strong track record of improving application performance and leading cross-functional teams..."
                        value={data.summary}
                        onChange={(e) => updateData({ summary: e.target.value })}
                    />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                    Tip: Keep it concise. Focus on your biggest achievements and what you bring to the table.
                </p>
            </div>

            <div>
                <label className="form-label flex items-center gap-2">
                    <Code className="h-4 w-4 text-gray-500" />
                    Skills (Comma-separated)
                </label>
                <div className="mt-2">
                    <textarea
                        rows={3}
                        className="form-textarea"
                        placeholder="JavaScript, React, Node.js, TypeScript, PostgreSQL, AWS, Docker..."
                        value={data.skills.join(', ')}
                        onChange={handleSkillsChange}
                    />
                </div>

                {/* Render tags preview */}
                {data.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {data.skills.map((skill, idx) => (
                            <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
