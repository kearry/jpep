import prisma from "@/lib/prisma";
import { RepresentativeType } from "@/types";

/**
 * Fetch all representatives with basic info
 */
export async function getAllRepresentatives(): Promise<RepresentativeType[]> {
    const representatives = await prisma.representative.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
            constituency: {
                select: {
                    name: true,
                    parish: true,
                },
            },
            socialMedia: true,
        },
        orderBy: {
            user: {
                name: "asc",
            },
        },
    });

    return representatives as unknown as RepresentativeType[];
}

/**
 * Fetch a representative by ID with detailed info
 */
export async function getRepresentativeById(id: string): Promise<RepresentativeType | null> {
    const representative = await prisma.representative.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
            constituency: {
                select: {
                    id: true,
                    name: true,
                    parish: true,
                },
            },
            socialMedia: true,
            committeeMembers: {
                include: {
                    committee: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            performanceMetrics: {
                orderBy: {
                    period: "desc",
                },
            },
        },
    });

    if (!representative) {
        return null;
    }

    return {
        ...representative,
        committees: representative.committeeMembers.map((member) => ({
            committee: member.committee,
            role: member.role,
        })),
    } as unknown as RepresentativeType;
}

/**
 * Fetch representatives by constituency ID
 */
export async function getRepresentativeByConstituency(constituencyId: string): Promise<RepresentativeType | null> {
    const representative = await prisma.representative.findUnique({
        where: {
            constituencyId,
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
            constituency: {
                select: {
                    name: true,
                    parish: true,
                },
            },
            socialMedia: true,
        },
    });

    if (!representative) {
        return null;
    }

    return representative as unknown as RepresentativeType;
}

/**
 * Fetch representatives by party
 */
export async function getRepresentativesByParty(party: string): Promise<RepresentativeType[]> {
    const representatives = await prisma.representative.findMany({
        where: {
            party,
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
            constituency: {
                select: {
                    name: true,
                    parish: true,
                },
            },
            socialMedia: true,
        },
        orderBy: {
            user: {
                name: "asc",
            },
        },
    });

    return representatives as unknown as RepresentativeType[];
}

/**
 * Search representatives by name
 */
export async function searchRepresentatives(query: string): Promise<RepresentativeType[]> {
    const representatives = await prisma.representative.findMany({
        where: {
            OR: [
                {
                    user: {
                        name: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    constituency: {
                        name: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
            constituency: {
                select: {
                    name: true,
                    parish: true,
                },
            },
            socialMedia: true,
        },
        orderBy: {
            user: {
                name: "asc",
            },
        },
    });

    return representatives as unknown as RepresentativeType[];
}

/**
 * Fetch the parliamentary activity of a representative
 */
export async function getRepresentativeActivity(representativeId: string, limit: number = 10) {
    const activities = await prisma.parliamentaryActivity.findMany({
        where: {
            representativeId,
        },
        orderBy: {
            date: "desc",
        },
        take: limit,
    });

    return activities;
}

/**
 * Fetch the voting records of a representative
 */
export async function getRepresentativeVotingRecords(representativeId: string, limit: number = 10) {
    const votingRecords = await prisma.votingRecord.findMany({
        where: {
            representativeId,
        },
        include: {
            bill: true,
        },
        orderBy: {
            date: "desc",
        },
        take: limit,
    });

    return votingRecords;
}

/**
 * Fetch the performance metrics of a representative
 */
export async function getRepresentativePerformanceMetrics(representativeId: string) {
    const metrics = await prisma.performanceMetric.findMany({
        where: {
            representativeId,
        },
        orderBy: [
            {
                period: "desc",
            },
            {
                metricType: "asc",
            },
        ],
    });

    return metrics;
}

/**
 * Fetch the statements made by a representative
 */
export async function getRepresentativeStatements(representativeId: string, limit: number = 10) {
    const statements = await prisma.statement.findMany({
        where: {
            representativeId,
        },
        orderBy: {
            date: "desc",
        },
        take: limit,
    });

    return statements;
}

/**
 * Fetch the committee memberships of a representative
 */
export async function getRepresentativeCommittees(representativeId: string) {
    const committees = await prisma.committeeMember.findMany({
        where: {
            representativeId,
        },
        include: {
            committee: true,
        },
    });

    return committees;
}