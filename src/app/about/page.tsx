import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "About | Jamaica Political Engagement Platform",
    description: "Learn about the Jamaica Political Engagement Platform (JPEP) and its mission to enhance democratic accountability",
};

export default function AboutPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight">About JPEP</h1>

            <div className="prose max-w-none">
                <p className="lead text-xl text-gray-700 dark:text-gray-300">
                    The Jamaica Political Engagement Platform (JPEP) is a digital initiative designed to connect Jamaican citizens with their elected representatives and enhance democratic accountability through transparency, communication, and engagement.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
                <p>
                    JPEP aims to strengthen democracy in Jamaica by providing citizens with the tools and information they need to effectively engage with their elected representatives and hold them accountable. We believe that an informed and engaged citizenry is essential for a healthy democracy.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Representative Profiles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400">
                                Comprehensive profiles of elected officials with biographical information, voting records, committee assignments, and performance metrics.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Tracking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400">
                                Metrics to track and evaluate representative performance including attendance, bill sponsorship, and constituent responsiveness.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Constituency Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400">
                                Detailed information about constituencies including demographics, projects, and boundaries.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Direct Communication</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400">
                                Secure messaging between citizens and their representatives to address concerns and provide feedback.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">Our Partners</h2>
                <p>
                    JPEP works in collaboration with key governmental and non-governmental organizations including:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                    <li>Parliament of Jamaica</li>
                    <li>Electoral Commission of Jamaica</li>
                    <li>Office of the Political Ombudsman</li>
                    <li>Ministry of Justice</li>
                    <li>Open Government Partnership</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">Get Involved</h2>
                <p>
                    We encourage all Jamaican citizens to participate in the democratic process by:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                    <li>Creating an account to access all features</li>
                    <li>Exploring your constituency information</li>
                    <li>Contacting your representative</li>
                    <li>Tracking parliamentary activities</li>
                    <li>Providing feedback to improve the platform</li>
                </ul>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mt-8">
                    <h3 className="text-lg font-semibold mb-4">Support JPEP</h3>
                    <p className="mb-4">
                        JPEP is a non-partisan, non-profit initiative dedicated to strengthening democratic participation in Jamaica. Your support helps us maintain and improve the platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Button className="bg-green-700 hover:bg-green-800">
                            Make a Donation
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/contact">Contact Us</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}