export interface UserProfile {
    id: string;
    full_name: string;
    created_at: string;
}

export interface ResumeData {
    id?: string;
    user_id?: string;
    title: string;
    raw_data: ResumeFormData;
    ai_content?: string;
    created_at?: string;
}

export interface ResumeFormData {
    contactInfo: ContactInfo;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
}

export interface ContactInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    current: boolean;
}
