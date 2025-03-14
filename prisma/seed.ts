import { PrismaClient, UserRole, BillStatus, ProjectStatus, MetricType, ActivityType, PetitionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting seeding...");

    // Clear existing data
    await prisma.performanceMetric.deleteMany();
    await prisma.statement.deleteMany();
    await prisma.parliamentaryActivity.deleteMany();
    await prisma.votingRecord.deleteMany();
    await prisma.bill.deleteMany();
    await prisma.committeeMember.deleteMany();
    await prisma.committee.deleteMany();
    await prisma.projectUpdate.deleteMany();
    await prisma.project.deleteMany();
    await prisma.socialMedia.deleteMany();
    await prisma.representative.deleteMany();
    await prisma.message.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.petitionSignature.deleteMany();
    await prisma.petition.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.constituency.deleteMany();
    await prisma.verificationToken.deleteMany();

    // Create constituencies
    console.log("Creating constituencies...");
    const constituencies = [
        {
            name: "Kingston Central",
            parish: "Kingston",
            boundaries: JSON.stringify({
                type: "Polygon",
                coordinates: [[[76.8, 18.0], [76.9, 18.0], [76.9, 17.9], [76.8, 17.9], [76.8, 18.0]]]
            }),
            population: 45000,
            registeredVoters: 32500,
            demographics: JSON.stringify({
                age: {
                    "18-29": 0.25,
                    "30-44": 0.35,
                    "45-64": 0.28,
                    "65+": 0.12
                },
                gender: {
                    male: 0.48,
                    female: 0.52
                }
            })
        },
        {
            name: "St. Andrew Western",
            parish: "St. Andrew",
            boundaries: JSON.stringify({
                type: "Polygon",
                coordinates: [[[76.7, 18.1], [76.8, 18.1], [76.8, 18.0], [76.7, 18.0], [76.7, 18.1]]]
            }),
            population: 52000,
            registeredVoters: 38000,
            demographics: JSON.stringify({
                age: {
                    "18-29": 0.22,
                    "30-44": 0.32,
                    "45-64": 0.31,
                    "65+": 0.15
                },
                gender: {
                    male: 0.47,
                    female: 0.53
                }
            })
        },
        {
            name: "Clarendon Northern",
            parish: "Clarendon",
            boundaries: JSON.stringify({
                type: "Polygon",
                coordinates: [[[77.2, 18.2], [77.3, 18.2], [77.3, 18.1], [77.2, 18.1], [77.2, 18.2]]]
            }),
            population: 48000,
            registeredVoters: 35000,
            demographics: JSON.stringify({
                age: {
                    "18-29": 0.20,
                    "30-44": 0.30,
                    "45-64": 0.35,
                    "65+": 0.15
                },
                gender: {
                    male: 0.49,
                    female: 0.51
                }
            })
        }
    ];

    for (const constituency of constituencies) {
        await prisma.constituency.create({
            data: constituency
        });
    }

    // Get constituencies for reference
    const kingstonCentral = await prisma.constituency.findFirst({
        where: { name: "Kingston Central" }
    });
    const stAndrewWestern = await prisma.constituency.findFirst({
        where: { name: "St. Andrew Western" }
    });
    const clarendonNorthern = await prisma.constituency.findFirst({
        where: { name: "Clarendon Northern" }
    });

    if (!kingstonCentral || !stAndrewWestern || !clarendonNorthern) {
        throw new Error("Failed to retrieve constituencies");
    }

    // Create users and representatives
    console.log("Creating users and representatives...");

    // Admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
        data: {
            name: "Admin User",
            email: "admin@jpep.org.jm",
            password: adminPassword,
            role: UserRole.ADMIN
        }
    });

    // Representative users
    const repPassword = await bcrypt.hash("rep123", 10);

    // Kingston Central Representative
    const kingstonRep = await prisma.user.create({
        data: {
            name: "Donovan Williams",
            email: "dwilliams@jpep.org.jm",
            password: repPassword,
            role: UserRole.REPRESENTATIVE,
            image: "https://randomuser.me/api/portraits/men/34.jpg",
            constituencyId: kingstonCentral.id
        }
    });

    await prisma.representative.create({
        data: {
            userId: kingstonRep.id,
            title: "Hon.",
            party: "JLP",
            biography: "Donovan Williams has served as the representative for Kingston Central since 2020. He focuses on urban development and youth empowerment.",
            phoneNumber: "876-555-0101",
            officeAddress: "12 South Avenue, Kingston",
            website: "https://dwilliams.gov.jm",
            constituencyId: kingstonCentral.id,
            socialMedia: {
                create: {
                    facebook: "DonovanWilliamsJA",
                    twitter: "@dwilliamsja",
                    instagram: "donovan_williams_mp"
                }
            }
        }
    });

    // St. Andrew Western Representative
    const stAndrewRep = await prisma.user.create({
        data: {
            name: "Angela Brown",
            email: "abrown@jpep.org.jm",
            password: repPassword,
            role: UserRole.REPRESENTATIVE,
            image: "https://randomuser.me/api/portraits/women/45.jpg",
            constituencyId: stAndrewWestern.id
        }
    });

    await prisma.representative.create({
        data: {
            userId: stAndrewRep.id,
            title: "Dr.",
            party: "PNP",
            biography: "Dr. Angela Brown has been serving St. Andrew Western since 2016. With a background in education, she champions educational reform and community development.",
            phoneNumber: "876-555-0202",
            officeAddress: "45 Hope Road, Kingston",
            website: "https://angelabrown.org.jm",
            constituencyId: stAndrewWestern.id,
            socialMedia: {
                create: {
                    facebook: "DrAngelaBrownJA",
                    twitter: "@drangelabrown",
                    instagram: "dr_angela_brown"
                }
            }
        }
    });

    // Clarendon Northern Representative
    const clarendonRep = await prisma.user.create({
        data: {
            name: "Robert Clarke",
            email: "rclarke@jpep.org.jm",
            password: repPassword,
            role: UserRole.REPRESENTATIVE,
            image: "https://randomuser.me/api/portraits/men/22.jpg",
            constituencyId: clarendonNorthern.id
        }
    });

    await prisma.representative.create({
        data: {
            userId: clarendonRep.id,
            title: "Mr.",
            party: "JLP",
            biography: "Robert Clarke represents Clarendon Northern since 2020. With a focus on agricultural development and rural infrastructure, he works to improve opportunities for farming communities.",
            phoneNumber: "876-555-0303",
            officeAddress: "7 Main Street, May Pen",
            website: "https://robertclarke.gov.jm",
            constituencyId: clarendonNorthern.id,
            socialMedia: {
                create: {
                    facebook: "RobertClarkeMP",
                    twitter: "@rclarkemp",
                    instagram: "robert_clarke_mp"
                }
            }
        }
    });

    // Create regular citizens
    const citizenPassword = await bcrypt.hash("citizen123", 10);

    await prisma.user.create({
        data: {
            name: "John Citizen",
            email: "john@example.com",
            password: citizenPassword,
            role: UserRole.CITIZEN,
            image: "https://randomuser.me/api/portraits/men/75.jpg",
            constituencyId: kingstonCentral.id
        }
    });

    await prisma.user.create({
        data: {
            name: "Maria Rodriguez",
            email: "maria@example.com",
            password: citizenPassword,
            role: UserRole.CITIZEN,
            image: "https://randomuser.me/api/portraits/women/65.jpg",
            constituencyId: stAndrewWestern.id
        }
    });

    // Create committees
    console.log("Creating committees...");

    const committees = [
        {
            name: "Public Accounts Committee",
            description: "Examines government expenditures to ensure they conform with parliamentary authorizations"
        },
        {
            name: "Infrastructure and Physical Development",
            description: "Oversees infrastructure projects and development across Jamaica"
        },
        {
            name: "Education and Human Resources",
            description: "Focuses on educational policy and human resource development"
        }
    ];

    for (const committee of committees) {
        await prisma.committee.create({
            data: committee
        });
    }

    // Link representatives to committees
    const publicAccounts = await prisma.committee.findFirst({
        where: { name: "Public Accounts Committee" }
    });
    const infrastructure = await prisma.committee.findFirst({
        where: { name: "Infrastructure and Physical Development" }
    });
    const education = await prisma.committee.findFirst({
        where: { name: "Education and Human Resources" }
    });

    if (!publicAccounts || !infrastructure || !education) {
        throw new Error("Failed to retrieve committees");
    }

    // Get representatives
    const kingstonRepData = await prisma.representative.findFirst({
        where: { constituencyId: kingstonCentral.id }
    });
    const stAndrewRepData = await prisma.representative.findFirst({
        where: { constituencyId: stAndrewWestern.id }
    });
    const clarendonRepData = await prisma.representative.findFirst({
        where: { constituencyId: clarendonNorthern.id }
    });

    if (!kingstonRepData || !stAndrewRepData || !clarendonRepData) {
        throw new Error("Failed to retrieve representatives");
    }

    // Committee memberships
    await prisma.committeeMember.createMany({
        data: [
            {
                representativeId: kingstonRepData.id,
                committeeId: infrastructure.id,
                role: "Chair",
                startDate: new Date(2020, 9, 1)
            },
            {
                representativeId: kingstonRepData.id,
                committeeId: publicAccounts.id,
                role: "Member",
                startDate: new Date(2020, 9, 1)
            },
            {
                representativeId: stAndrewRepData.id,
                committeeId: education.id,
                role: "Chair",
                startDate: new Date(2020, 9, 1)
            },
            {
                representativeId: stAndrewRepData.id,
                committeeId: publicAccounts.id,
                role: "Vice Chair",
                startDate: new Date(2020, 9, 1)
            },
            {
                representativeId: clarendonRepData.id,
                committeeId: infrastructure.id,
                role: "Member",
                startDate: new Date(2020, 9, 1)
            },
            {
                representativeId: clarendonRepData.id,
                committeeId: education.id,
                role: "Member",
                startDate: new Date(2020, 9, 1)
            }
        ]
    });

    // Create bills
    console.log("Creating bills...");

    const bills = [
        {
            title: "Urban Renewal and Development Act",
            description: "An act to establish a framework for the renewal and development of urban areas across Jamaica",
            status: BillStatus.PASSED_HOUSE,
            introducedDate: new Date(2024, 8, 15),
            lastUpdatedDate: new Date(2024, 10, 10),
            category: "Urban Development",
            documentUrl: "/documents/bills/urban-renewal-act.pdf",
            sponsorId: kingstonRepData.id
        },
        {
            title: "Education Reform Bill",
            description: "A bill to modernize the education system and improve educational outcomes across Jamaica",
            status: BillStatus.IN_COMMITTEE,
            introducedDate: new Date(2024, 7, 20),
            lastUpdatedDate: new Date(2024, 9, 5),
            category: "Education",
            documentUrl: "/documents/bills/education-reform.pdf",
            sponsorId: stAndrewRepData.id
        },
        {
            title: "Agricultural Investment and Innovation Act",
            description: "An act to promote investment and innovation in Jamaica's agricultural sector",
            status: BillStatus.INTRODUCED,
            introducedDate: new Date(2024, 9, 30),
            lastUpdatedDate: new Date(2024, 10, 15),
            category: "Agriculture",
            documentUrl: "/documents/bills/agricultural-investment.pdf",
            sponsorId: clarendonRepData.id
        }
    ];

    for (const bill of bills) {
        await prisma.bill.create({
            data: bill
        });
    }

    // Create voting records
    console.log("Creating voting records...");

    const urbanRenewalBill = await prisma.bill.findFirst({
        where: { title: "Urban Renewal and Development Act" }
    });

    const educationBill = await prisma.bill.findFirst({
        where: { title: "Education Reform Bill" }
    });

    const agricultureBill = await prisma.bill.findFirst({
        where: { title: "Agricultural Investment and Innovation Act" }
    });

    if (!urbanRenewalBill || !educationBill || !agricultureBill) {
        throw new Error("Failed to retrieve bills");
    }

    await prisma.votingRecord.createMany({
        data: [
            {
                billId: urbanRenewalBill.id,
                representativeId: kingstonRepData.id,
                vote: "YES",
                date: new Date(2024, 10, 5),
                explanation: "This bill is crucial for revitalizing urban areas and improving living conditions."
            },
            {
                billId: urbanRenewalBill.id,
                representativeId: stAndrewRepData.id,
                vote: "YES",
                date: new Date(2024, 10, 5),
                explanation: "While I have some reservations about funding mechanisms, the overall aim of urban renewal is important."
            },
            {
                billId: urbanRenewalBill.id,
                representativeId: clarendonRepData.id,
                vote: "ABSTAIN",
                date: new Date(2024, 10, 5),
                explanation: "I support urban renewal but believe more attention should be given to rural areas."
            },
            {
                billId: educationBill.id,
                representativeId: kingstonRepData.id,
                vote: "NO",
                date: new Date(2024, 9, 1),
                explanation: "The current draft does not adequately address vocational training needs."
            },
            {
                billId: educationBill.id,
                representativeId: stAndrewRepData.id,
                vote: "YES",
                date: new Date(2024, 9, 1),
                explanation: "Educational reform is vital for Jamaica's future competitiveness."
            },
            {
                billId: educationBill.id,
                representativeId: clarendonRepData.id,
                vote: "YES",
                date: new Date(2024, 9, 1),
                explanation: "I believe this bill will help bridge the urban-rural education gap."
            }
            // No voting records for agriculture bill as it was just introduced
        ]
    });

    // Create constituency projects
    console.log("Creating constituency projects...");

    const kingstonProjects = [
        {
            title: "Downtown Market Renovation",
            description: "Renovation of the historic downtown market to improve facilities for vendors and shoppers",
            status: ProjectStatus.IN_PROGRESS,
            budget: 25000000,
            startDate: new Date(2024, 2, 15),
            endDate: new Date(2025, 2, 15),
            constituencyId: kingstonCentral.id
        },
        {
            title: "Youth Technology Center",
            description: "Establishment of a technology training center to provide digital skills training for youth",
            status: ProjectStatus.APPROVED,
            budget: 18000000,
            startDate: new Date(2024, 11, 1),
            constituencyId: kingstonCentral.id
        }
    ];

    const stAndrewProjects = [
        {
            title: "Community Library Expansion",
            description: "Expansion of the community library to include digital resources and a learning center",
            status: ProjectStatus.COMPLETED,
            budget: 12000000,
            startDate: new Date(2023, 6, 10),
            endDate: new Date(2024, 5, 20),
            constituencyId: stAndrewWestern.id
        },
        {
            title: "Public Park Rehabilitation",
            description: "Rehabilitation of the central park with improved facilities, lighting, and accessibility",
            status: ProjectStatus.IN_PROGRESS,
            budget: 15000000,
            startDate: new Date(2024, 8, 5),
            endDate: new Date(2025, 4, 30),
            constituencyId: stAndrewWestern.id
        }
    ];

    const clarendonProjects = [
        {
            title: "Rural Road Improvement",
            description: "Improvement of rural road infrastructure to enhance connectivity for farming communities",
            status: ProjectStatus.IN_PROGRESS,
            budget: 30000000,
            startDate: new Date(2024, 4, 1),
            endDate: new Date(2025, 3, 30),
            constituencyId: clarendonNorthern.id
        },
        {
            title: "Agricultural Training Center",
            description: "Establishment of a training center to provide modern farming techniques and business skills",
            status: ProjectStatus.PROPOSED,
            budget: 22000000,
            startDate: new Date(2025, 1, 15),
            constituencyId: clarendonNorthern.id
        }
    ];

    // Create all projects
    for (const project of [...kingstonProjects, ...stAndrewProjects, ...clarendonProjects]) {
        await prisma.project.create({
            data: project
        });
    }

    // Add project updates
    const downtownMarket = await prisma.project.findFirst({
        where: { title: "Downtown Market Renovation" }
    });

    const communityLibrary = await prisma.project.findFirst({
        where: { title: "Community Library Expansion" }
    });

    const ruralRoad = await prisma.project.findFirst({
        where: { title: "Rural Road Improvement" }
    });

    if (!downtownMarket || !communityLibrary || !ruralRoad) {
        throw new Error("Failed to retrieve projects");
    }

    await prisma.projectUpdate.createMany({
        data: [
            {
                projectId: downtownMarket.id,
                date: new Date(2024, 4, 15),
                description: "Foundation work completed. Starting structural renovations next week.",
                imageUrl: "/images/projects/downtown-market-1.jpg"
            },
            {
                projectId: downtownMarket.id,
                date: new Date(2024, 7, 10),
                description: "Structural renovations 60% complete. Electrical and plumbing systems being installed.",
                imageUrl: "/images/projects/downtown-market-2.jpg"
            },
            {
                projectId: communityLibrary.id,
                date: new Date(2023, 9, 20),
                description: "Building expansion completed. Starting interior work and installation of digital systems.",
                imageUrl: "/images/projects/library-1.jpg"
            },
            {
                projectId: communityLibrary.id,
                date: new Date(2024, 2, 15),
                description: "Interior work completed. Digital systems installed and tested. Staff training in progress.",
                imageUrl: "/images/projects/library-2.jpg"
            },
            {
                projectId: communityLibrary.id,
                date: new Date(2024, 5, 20),
                description: "Project completed and facility opened to the public. Positive feedback from community.",
                imageUrl: "/images/projects/library-3.jpg"
            },
            {
                projectId: ruralRoad.id,
                date: new Date(2024, 6, 10),
                description: "First phase of road improvements (5km section) completed. Starting second phase next month.",
                imageUrl: "/images/projects/rural-road-1.jpg"
            }
        ]
    });

    // Create performance metrics
    console.log("Creating performance metrics...");

    const metrics = [
        // Kingston Central Rep metrics
        {
            representativeId: kingstonRepData.id,
            metricType: MetricType.ATTENDANCE_RATE,
            value: 92.5,
            period: "2024-Q1",
            description: "Percentage of parliamentary sessions attended"
        },
        {
            representativeId: kingstonRepData.id,
            metricType: MetricType.BILLS_SPONSORED,
            value: 3,
            period: "2024-Q1",
            description: "Number of bills sponsored or co-sponsored"
        },
        {
            representativeId: kingstonRepData.id,
            metricType: MetricType.QUESTIONS_ASKED,
            value: 15,
            period: "2024-Q1",
            description: "Number of parliamentary questions asked"
        },
        {
            representativeId: kingstonRepData.id,
            metricType: MetricType.CONSTITUENCY_VISITS,
            value: 8,
            period: "2024-Q1",
            description: "Number of official constituency visits/meetings"
        },
        {
            representativeId: kingstonRepData.id,
            metricType: MetricType.RESPONSE_RATE,
            value: 78.3,
            period: "2024-Q1",
            description: "Percentage of constituent inquiries responded to within 5 business days"
        },
        // St. Andrew Western Rep metrics
        {
            representativeId: stAndrewRepData.id,
            metricType: MetricType.ATTENDANCE_RATE,
            value: 88.7,
            period: "2024-Q1",
            description: "Percentage of parliamentary sessions attended"
        },
        {
            representativeId: stAndrewRepData.id,
            metricType: MetricType.BILLS_SPONSORED,
            value: 2,
            period: "2024-Q1",
            description: "Number of bills sponsored or co-sponsored"
        },
        {
            representativeId: stAndrewRepData.id,
            metricType: MetricType.QUESTIONS_ASKED,
            value: 22,
            period: "2024-Q1",
            description: "Number of parliamentary questions asked"
        },
        {
            representativeId: stAndrewRepData.id,
            metricType: MetricType.CONSTITUENCY_VISITS,
            value: 12,
            period: "2024-Q1",
            description: "Number of official constituency visits/meetings"
        },
        {
            representativeId: stAndrewRepData.id,
            metricType: MetricType.RESPONSE_RATE,
            value: 85.2,
            period: "2024-Q1",
            description: "Percentage of constituent inquiries responded to within 5 business days"
        },
        // Clarendon Northern Rep metrics
        {
            representativeId: clarendonRepData.id,
            metricType: MetricType.ATTENDANCE_RATE,
            value: 94.0,
            period: "2024-Q1",
            description: "Percentage of parliamentary sessions attended"
        },
        {
            representativeId: clarendonRepData.id,
            metricType: MetricType.BILLS_SPONSORED,
            value: 1,
            period: "2024-Q1",
            description: "Number of bills sponsored or co-sponsored"
        },
        {
            representativeId: clarendonRepData.id,
            metricType: MetricType.QUESTIONS_ASKED,
            value: 8,
            period: "2024-Q1",
            description: "Number of parliamentary questions asked"
        },
        {
            representativeId: clarendonRepData.id,
            metricType: MetricType.CONSTITUENCY_VISITS,
            value: 15,
            period: "2024-Q1",
            description: "Number of official constituency visits/meetings"
        },
        {
            representativeId: clarendonRepData.id,
            metricType: MetricType.RESPONSE_RATE,
            value: 72.8,
            period: "2024-Q1",
            description: "Percentage of constituent inquiries responded to within 5 business days"
        }
    ];

    await prisma.performanceMetric.createMany({
        data: metrics
    });

    // Create statements
    console.log("Creating statements...");

    const statements = [
        {
            representativeId: kingstonRepData.id,
            topic: "Urban Development",
            content: "The renewal of our urban centers is vital for Jamaica's economic growth. I am committed to supporting initiatives that improve infrastructure, create jobs, and enhance quality of life in our cities.",
            date: new Date(2024, 9, 15),
            source: "Parliamentary Debate",
            url: "/documents/statements/urban-development-statement.pdf"
        },
        {
            representativeId: kingstonRepData.id,
            topic: "Youth Employment",
            content: "Addressing youth unemployment is one of my top priorities. We need to invest in skills training, entrepreneurship programs, and create a business environment that encourages job creation.",
            date: new Date(2024, 8, 22),
            source: "Constituency Town Hall",
            url: null
        },
        {
            representativeId: stAndrewRepData.id,
            topic: "Education Reform",
            content: "Our education system needs urgent reform to prepare our youth for the jobs of tomorrow. This includes modernizing curriculum, improving teacher training, and investing in educational technology.",
            date: new Date(2024, 7, 18),
            source: "Policy Statement",
            url: "/documents/statements/education-reform-statement.pdf"
        },
        {
            representativeId: stAndrewRepData.id,
            topic: "Healthcare Access",
            content: "Every Jamaican deserves access to quality healthcare. We must strengthen our primary healthcare system, reduce wait times, and ensure essential medications are affordable and available.",
            date: new Date(2024, 9, 5),
            source: "Media Interview",
            url: null
        },
        {
            representativeId: clarendonRepData.id,
            topic: "Agricultural Development",
            content: "Agriculture remains the backbone of rural Jamaica. To strengthen this sector, we need to invest in modern farming techniques, improve access to markets, and provide support for farmers affected by climate change.",
            date: new Date(2024, 10, 2),
            source: "Parliamentary Committee",
            url: "/documents/statements/agricultural-development-statement.pdf"
        },
        {
            representativeId: clarendonRepData.id,
            topic: "Rural Infrastructure",
            content: "Improving rural infrastructure is essential for balanced national development. This includes better roads, reliable water supply, and expanded internet access to support rural businesses and communities.",
            date: new Date(2024, 9, 12),
            source: "Constituency Meeting",
            url: null
        }
    ];

    for (const statement of statements) {
        await prisma.statement.create({
            data: statement
        });
    }

    // Create parliamentary activities
    console.log("Creating parliamentary activities...");

    const activities = [
        {
            representativeId: kingstonRepData.id,
            activityType: ActivityType.SPEECH,
            date: new Date(2024, 10, 5),
            description: "Speech on the importance of urban renewal for economic development",
            documentUrl: "/documents/speeches/urban-renewal-speech.pdf"
        },
        {
            representativeId: kingstonRepData.id,
            activityType: ActivityType.MOTION,
            date: new Date(2024, 9, 18),
            description: "Motion to increase funding for youth entrepreneurship programs",
            documentUrl: null
        },
        {
            representativeId: stAndrewRepData.id,
            activityType: ActivityType.QUESTION,
            date: new Date(2024, 10, 8),
            description: "Question to Minister of Education regarding teacher training programs",
            documentUrl: null
        },
        {
            representativeId: stAndrewRepData.id,
            activityType: ActivityType.COMMITTEE_WORK,
            date: new Date(2024, 9, 22),
            description: "Chaired meeting of the Education and Human Resources Committee",
            documentUrl: "/documents/committee/education-meeting-minutes.pdf"
        },
        {
            representativeId: clarendonRepData.id,
            activityType: ActivityType.SPEECH,
            date: new Date(2024, 9, 28),
            description: "Speech on the need for increased investment in agricultural innovation",
            documentUrl: "/documents/speeches/agricultural-innovation-speech.pdf"
        },
        {
            representativeId: clarendonRepData.id,
            activityType: ActivityType.MOTION,
            date: new Date(2024, 8, 15),
            description: "Motion to improve rural road infrastructure",
            documentUrl: null
        }
    ];

    for (const activity of activities) {
        await prisma.parliamentaryActivity.create({
            data: activity
        });
    }

    // Create petitions
    console.log("Creating petitions...");

    const petitions = [
        {
            title: "Improve Public Transportation in Kingston",
            description: "We call on the government to improve the public transportation system in Kingston with more buses, better routes, and improved reliability.",
            targetCount: 5000,
            createdAt: new Date(2024, 8, 1),
            expiresAt: new Date(2024, 11, 1),
            status: PetitionStatus.ACTIVE
        },
        {
            title: "Increase Funding for Public Schools",
            description: "We urge the government to increase funding for public schools to improve facilities, provide more resources, and support teacher development.",
            targetCount: 10000,
            createdAt: new Date(2024, 7, 15),
            expiresAt: new Date(2024, 10, 15),
            status: PetitionStatus.COMPLETED
        },
        {
            title: "Support for Small Farmers",
            description: "We call for increased support for small farmers including subsidies, technical assistance, and improved access to markets.",
            targetCount: 3000,
            createdAt: new Date(2024, 9, 10),
            expiresAt: new Date(2025, 0, 10),
            status: PetitionStatus.ACTIVE
        }
    ];

    for (const petition of petitions) {
        await prisma.petition.create({
            data: petition
        });
    }

    console.log("Seeding completed successfully");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });