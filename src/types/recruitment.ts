export interface JobRole {
    id: string;
    title: string;
    department: string; // e.g. "Avionics & Embedded", "Propulsion & Systems", "Payload & Orbital Science", "Software & Ground Control", "Design & Outreach", "Operations & Management"
    type: 'Core Team' | 'Fellowship' | 'Internship' | 'Project Member' | 'Volunteer';
    location: string; // e.g. "ZCOER Space Lab, Pune", "Hybrid / Remote", "On-Campus"
    commitment?: string; // e.g. "8-12 hrs/week"
    description: string;
    responsibilities: string[];
    requirements: string[];
    postedAt?: string;
    deadline?: string;
    status: 'open' | 'closed';
    applyUrl?: string; // External form/link or internal application
    contactEmail?: string;
    openPositions?: number;
}

export interface RoleAlertSubscription {
    id?: string;
    email: string;
    subscribedAt: string;
    createdAt?: string | Date | null;
    active: boolean;
    source: string;
}
