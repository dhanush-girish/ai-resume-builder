import { ContactInfo } from '@/types';
import { User, Mail, Phone, MapPin, Link as LinkIcon, Linkedin } from 'lucide-react';

interface Props {
    data: ContactInfo;
    updateData: (data: Partial<ContactInfo>) => void;
}

export function ContactStep({ data, updateData }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateData({ [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            className="form-input"
                            placeholder="John Doe"
                            value={data.fullName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="form-input"
                            placeholder="john@example.com"
                            value={data.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            className="form-input"
                            placeholder="+1 (555) 000-0000"
                            value={data.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="location" className="form-label">Location</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            className="form-input"
                            placeholder="City, State"
                            value={data.location}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="website" className="form-label">
                        Website <span className="text-gray-600">(Optional)</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="url"
                            name="website"
                            id="website"
                            className="form-input"
                            placeholder="https://johndoe.com"
                            value={data.website || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="linkedin" className="form-label">
                        LinkedIn <span className="text-gray-600">(Optional)</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Linkedin className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="url"
                            name="linkedin"
                            id="linkedin"
                            className="form-input"
                            placeholder="https://linkedin.com/in/johndoe"
                            value={data.linkedin || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
