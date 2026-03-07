import { Experience } from '@/types';
import { Briefcase, Calendar, Trash2, Plus, Building2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    data: Experience[];
    updateData: (data: Experience[]) => void;
}

export function ExperienceStep({ data, updateData }: Props) {
    const handleAdd = () => {
        updateData([
            ...data,
            {
                id: uuidv4(),
                company: '',
                role: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
            },
        ]);
    };

    const handleRemove = (id: string) => {
        updateData(data.filter((item) => item.id !== id));
    };

    const handleChange = (id: string, field: keyof Experience, value: string | boolean) => {
        updateData(
            data.map((item) => {
                if (item.id === id) {
                    if (field === 'current' && value === true) {
                        return { ...item, [field]: value, endDate: '' };
                    }
                    return { ...item, [field]: value };
                }
                return item;
            })
        );
    };

    return (
        <div className="space-y-6">
            {data.map((exp, index) => (
                <div key={exp.id} className="relative border border-[var(--card-border)] rounded-xl p-6 bg-[var(--surface-1)] group hover:border-[var(--accent-1)]/40 transition-colors">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-[var(--accent-1)] rounded-full flex items-center justify-center font-bold text-sm text-[#1C1C1E]">
                        {index + 1}
                    </div>

                    <button
                        onClick={() => handleRemove(exp.id)}
                        className="absolute top-4 right-4 text-gray-600 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove Experience"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div>
                            <label className="form-label">Company Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Acme Corp"
                                    value={exp.company}
                                    onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Role / Title</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Senior Software Engineer"
                                    value={exp.role}
                                    onChange={(e) => handleChange(exp.id, 'role', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:col-span-2">
                            <div>
                                <label className="form-label">Start Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="month"
                                        className="form-input"
                                        value={exp.startDate}
                                        onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">End Date</label>
                                <div className={`relative ${exp.current ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="month"
                                        className="form-input"
                                        value={exp.endDate}
                                        onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                                        disabled={exp.current}
                                    />
                                </div>
                                <div className="mt-3 flex items-center">
                                    <input
                                        id={`current-${exp.id}`}
                                        name={`current-${exp.id}`}
                                        type="checkbox"
                                        className="h-4 w-4 accent-[var(--accent-1)] rounded border-[var(--card-border)] bg-[var(--surface-1)]"
                                        checked={exp.current}
                                        onChange={(e) => handleChange(exp.id, 'current', e.target.checked)}
                                    />
                                    <label htmlFor={`current-${exp.id}`} className="ml-2 block text-sm text-gray-400">
                                        I currently work here
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="form-label">Description / Responsibilities</label>
                            <textarea
                                rows={4}
                                className="form-textarea"
                                placeholder="Describe your achievements and daily tasks..."
                                value={exp.description}
                                onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={handleAdd}
                className="w-full flex items-center justify-center py-4 border-2 border-dashed border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent-1)] hover:border-[var(--accent-1)]/40 hover:bg-[var(--accent-1)]/10 transition-all font-medium gap-2"
            >
                <Plus className="h-5 w-5" />
                Add Experience
            </button>
        </div>
    );
}
