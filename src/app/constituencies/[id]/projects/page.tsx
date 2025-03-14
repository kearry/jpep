import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getConstituencyById, getConstituencyProjects } from "@/services/constituency-service";
import { ChevronLeft, Calendar, Ban, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { id: string } }) {
    const constituency = await getConstituencyById(params.id);

    if (!constituency) {
        return {
            title: "Constituency Not Found | Jamaica Political Engagement Platform",
        };
    }

    return {
        title: `${constituency.name} Projects | Jamaica Political Engagement Platform`,
        description: `View development projects in ${constituency.name} constituency, ${constituency.parish}, Jamaica.`,
    };
}

export default async function ConstituencyProjectsPage({
    params,
}: {
    params: { id: string };
}) {
    const constituency = await getConstituencyById(params.id);

    if (!constituency) {
        notFound();
    }

    // Fetch projects
    const projects = await getConstituencyProjects(params.id);

    // Group projects by status
    const projectsByStatus = {
        COMPLETED: projects.filter(p => p.status === 'COMPLETED'),
        IN_PROGRESS: projects.filter(p => p.status === 'IN_PROGRESS'),
        APPROVED: projects.filter(p => p.status === 'APPROVED'),
        PROPOSED: projects.filter(p => p.status === 'PROPOSED'),
        CANCELLED: projects.filter(p => p.status === 'CANCELLED'),
    };

    // Calculate total budget by status
    const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
    const completedBudget = projectsByStatus.COMPLETED.reduce((sum, project) => sum + project.budget, 0);
    const inProgressBudget = projectsByStatus.IN_PROGRESS.reduce((sum, project) => sum + project.budget, 0);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'IN_PROGRESS':
                return <Clock className="h-5 w-5 text-blue-500" />;
            case 'APPROVED':
                return <Calendar className="h-5 w-5 text-purple-500" />;
            case 'PROPOSED':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case 'CANCELLED':
                return <Ban className="h-5 w-5 text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Button variant="ghost" size="sm" asChild className="mr-4">
                    <Link href={`/constituencies/${params.id}`}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Constituency
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">{constituency.name} Projects</h1>
            </div>

            {/* Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Projects Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-sm font-medium text-gray-500">Total Projects</p>
                            <p className="text-3xl font-bold">{projects.length}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-sm font-medium text-gray-500">Total Budget</p>
                            <p className="text-3xl font-bold">{formatCurrency(totalBudget)}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-sm font-medium text-green-700">Completed</p>
                            <p className="text-3xl font-bold text-green-700">{projectsByStatus.COMPLETED.length}</p>
                            <p className="text-sm text-green-600">{formatCurrency(completedBudget)}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <p className="text-sm font-medium text-blue-700">In Progress</p>
                            <p className="text-3xl font-bold text-blue-700">{projectsByStatus.IN_PROGRESS.length}</p>
                            <p className="text-sm text-blue-600">{formatCurrency(inProgressBudget)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Projects by Status */}
            {['IN_PROGRESS', 'APPROVED', 'PROPOSED', 'COMPLETED', 'CANCELLED'].map(status => {
                const statusProjects = projectsByStatus[status as keyof typeof projectsByStatus];
                if (statusProjects.length === 0) return null;

                return (
                    <Card key={status}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center">
                                {getStatusIcon(status)}
                                <CardTitle className="ml-2">
                                    {status.replace('_', ' ')} Projects
                                </CardTitle>
                            </div>
                            <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-full">
                                {statusProjects.length} projects
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {statusProjects.map(project => (
                                    <div key={project.id} className="border rounded-lg p-4">
                                        <h3 className="text-lg font-semibold">{project.title}</h3>
                                        <p className="mt-2 text-gray-600">{project.description}</p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Budget</p>
                                                <p className="font-medium">{formatCurrency(project.budget)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Start Date</p>
                                                <p className="font-medium">{formatDate(project.startDate)}</p>
                                            </div>
                                            {project.endDate && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">End Date</p>
                                                    <p className="font-medium">{formatDate(project.endDate)}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Project Updates */}
                                        {project.updates && project.updates.length > 0 && (
                                            <div className="mt-4 pt-4 border-t">
                                                <h4 className="text-sm font-medium mb-2">Updates</h4>
                                                <ul className="space-y-2">
                                                    {project.updates.map(update => (
                                                        <li key={update.id} className="bg-gray-50 p-3 rounded-md">
                                                            <div className="flex justify-between">
                                                                <span className="text-sm font-medium">{formatDate(update.date)}</span>
                                                            </div>
                                                            <p className="text-sm mt-1">{update.description}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}

            {projects.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-500">No projects available for this constituency.</p>
                    <Button variant="outline" asChild className="mt-4">
                        <Link href={`/constituencies/${params.id}`}>
                            Return to Constituency
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}