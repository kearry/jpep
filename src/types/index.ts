import { Session } from "next-auth";

// Extend the next-auth session type to include our custom fields
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
            constituencyId?: string | null;
        };
    }
}

// Representative Type
export interface RepresentativeType {
    id: string;
    userId: string;
    title: string;
    party: string;
    biography: string;
    phoneNumber?: string | null;
    officeAddress?: string | null;
    website?: string | null;
    constituencyId: string;
    user: {
        name: string | null;
        email: string | null;
        image: string | null;
    };
    constituency: {
        id?: string;
        name: string;
        parish: string;
    };
    socialMedia?: {
        facebook?: string | null;
        twitter?: string | null;
        instagram?: string | null;
        youtube?: string | null;
        linkedIn?: string | null;
    } | null;
    committees?: {
        committee: {
            id: string;
            name: string;
        };
        role: string;
    }[];
    performanceMetrics?: {
        metricType: string;
        value: number;
        period: string;
    }[];
}

// Constituency Type
export interface ConstituencyType {
    id: string;
    name: string;
    parish: string;
    boundaries: string; // GeoJSON
    population?: number | null;
    registeredVoters?: number | null;
    demographics?: string | null; // JSON
    representative?: {
        id: string;
        title: string;
        party: string;
        user: {
            name: string | null;
            image: string | null;
        };
    } | null;
    projects?: {
        id: string;
        title: string;
        status: string;
        budget: number;
        startDate: string;
        endDate?: string | null;
    }[];
}

// Bill Type
export interface BillType {
    id: string;
    title: string;
    description: string;
    status: string;
    introducedDate: string;
    lastUpdatedDate: string;
    category: string;
    documentUrl?: string | null;
    sponsor: {
        id: string;
        title: string;
        party: string;
        user: {
            name: string | null;
        };
    };
    votingRecords?: {
        id: string;
        representativeId: string;
        vote: string;
        date: string;
        representative: {
            title: string;
            party: string;
            user: {
                name: string | null;
            };
        };
    }[];
}

// Committee Type
export interface CommitteeType {
    id: string;
    name: string;
    description?: string | null;
    members: {
        representativeId: string;
        role: string;
        representative: {
            title: string;
            party: string;
            user: {
                name: string | null;
                image: string | null;
            };
        };
    }[];
}

// Project Type
export interface ProjectType {
    id: string;
    title: string;
    description: string;
    status: string;
    budget: number;
    startDate: string;
    endDate?: string | null;
    constituencyId: string;
    constituency: {
        name: string;
        parish: string;
    };
    updates?: {
        id: string;
        date: string;
        description: string;
        imageUrl?: string | null;
    }[];
}

// Message Type
export interface MessageType {
    id: string;
    subject: string;
    content: string;
    senderId: string;
    sender: {
        name: string | null;
        email: string | null;
        image: string | null;
    };
    recipientId: string;
    recipient: {
        name: string | null;
        email: string | null;
        image: string | null;
    };
    read: boolean;
    createdAt: string;
    updatedAt: string;
}

// Petition Type
export interface PetitionType {
    id: string;
    title: string;
    description: string;
    targetCount: number;
    createdAt: string;
    expiresAt: string;
    status: string;
    signaturesCount: number;
}

// Parliamentary Activity Type
export interface ParliamentaryActivityType {
    id: string;
    representativeId: string;
    representative: {
        title: string;
        party: string;
        user: {
            name: string | null;
        };
    };
    activityType: string;
    date: string;
    description: string;
    documentUrl?: string | null;
}

// Performance Metric Type
export interface PerformanceMetricType {
    id: string;
    representativeId: string;
    metricType: string;
    value: number;
    period: string;
    description?: string | null;
}

// Statement Type
export interface StatementType {
    id: string;
    representativeId: string;
    representative: {
        title: string;
        party: string;
        user: {
            name: string | null;
        };
    };
    topic: string;
    content: string;
    date: string;
    source: string;
    url?: string | null;
}

// Feedback Type
export interface FeedbackType {
    id: string;
    userId: string;
    content: string;
    category: string;
    createdAt: string;
}