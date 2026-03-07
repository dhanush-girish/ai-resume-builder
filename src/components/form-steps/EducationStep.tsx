import { Education } from '@/types';
import { GraduationCap, BookOpen, Calendar, Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    data: Education[];
    updateData: (data: Education[]) => void;
}

export function EducationStep({ data, updateData }: Props) {
    const handleAdd = () => {
        updateData([
            ...data,
            {
                id: uuidv4(),
                school: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                current: false,
            },
        ]);
    };

    const handleRemove = (id: string) => {
        updateData(data.filter((item) => item.id !== id));
    };

    const handleChange = (id: string, field: keyof Education, value: string | boolean) => {
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
            {data.map((edu, index) => (
                <div key={edu.id} className="relative border border-white/[0.08] rounded-xl p-6 bg-white/[0.02] group hover:border-indigo-500/20 transition-colors">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-500/20">
                        {index + 1}
                    </div>

                    <button
                        onClick={() => handleRemove(edu.id)}
                        className="absolute top-4 right-4 text-gray-600 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove Education"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div>
                            <label className="form-label">School / University</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <GraduationCap className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="State University"
                                    value={edu.school}
                                    onChange={(e) => handleChange(edu.id, 'school', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="form-label">Degree</label>
                                <input
                                    type="text"
                                    className="form-input !pl-4"
                                    placeholder="B.Sc."
                                    value={edu.degree}
                                    onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="form-label">Field of Study</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BookOpen className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Computer Science"
                                        value={edu.fieldOfStudy}
                                        onChange={(e) => handleChange(edu.id, 'fieldOfStudy', e.target.value)}
                                    />
                                </div>
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
                                        value={edu.startDate}
                                        onChange={(e) => handleChange(edu.id, 'startDate', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">
                                    {edu.current ? 'Graduation Date' : 'End Date'}
                                </label>
                                <div className={`relative ${edu.current ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="month"
                                        className="form-input"
                                        value={edu.endDate}
                                        onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)}
                                        disabled={edu.current}
                                    />
                                </div>
                                <div className="mt-3 flex items-center">
                                    <input
                                        id={`edu-current-${edu.id}`}
                                        name={`edu-current-${edu.id}`}
                                        type="checkbox"
                                        className="h-4 w-4 accent-indigo-500 rounded border-white/20 bg-white/5"
                                        checked={edu.current}
                                        onChange={(e) => handleChange(edu.id, 'current', e.target.checked)}
                                    />
                                    <label htmlFor={`edu-current-${edu.id}`} className="ml-2 block text-sm text-gray-400">
                                        I am currently studying here
                                    </label>
                                </div>
                            </div>
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
                Add Education
            </button>
        </div>
    );
}
