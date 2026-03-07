import { Project } from '@/types';
import { Briefcase, Link as LinkIcon, Trash2, Plus, PenTool } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    data: Project[];
    updateData: (data: Project[]) => void;
}

export function ProjectsStep({ data, updateData }: Props) {
    const handleAdd = () => {
        updateData([
            ...data,
            {
                id: uuidv4(),
                name: '',
                description: '',
                link: '',
            },
        ]);
    };

    const handleRemove = (id: string) => {
        updateData(data.filter((item) => item.id !== id));
    };

    const handleChange = (id: string, field: keyof Project, value: string) => {
        updateData(
            data.map((item) => {
                if (item.id === id) {
                    return { ...item, [field]: value };
                }
                return item;
            })
        );
    };

    return (
        <div className="space-y-6">
            {data.map((proj, index) => (
                <div key={proj.id} className="relative border border-white/[0.08] rounded-xl p-6 bg-white/[0.02] group hover:border-indigo-500/20 transition-colors">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-500/20">
                        {index + 1}
                    </div>

                    <button
                        onClick={() => handleRemove(proj.id)}
                        className="absolute top-4 right-4 text-gray-600 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove Project"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div>
                            <label className="form-label">Project Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Portfolio Website"
                                    value={proj.name}
                                    onChange={(e) => handleChange(proj.id, 'name', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Link (optional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LinkIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="https://github.com/..."
                                    value={proj.link || ''}
                                    onChange={(e) => handleChange(proj.id, 'link', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="form-label mb-2 flex items-center gap-2">
                                <PenTool className="h-4 w-4 text-gray-500" />
                                Description
                            </label>
                            <textarea
                                rows={4}
                                className="form-textarea"
                                placeholder="Describe the project, technologies used, and your role..."
                                value={proj.description}
                                onChange={(e) => handleChange(proj.id, 'description', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={handleAdd}
                className="w-full flex items-center justify-center py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-500 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all font-medium gap-2"
            >
                <Plus className="h-5 w-5" />
                Add Project
            </button>
        </div>
    );
}
