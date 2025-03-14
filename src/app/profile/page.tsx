"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, MapPin, Building } from "lucide-react";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        constituency: "",
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setFormData({
                name: session.user.name || "",
                email: session.user.email || "",
                constituency: "Not set", // This would come from API in a real implementation
            });
        }
    }, [session]);

    // If the user is not logged in, redirect to login page
    if (status === "unauthenticated") {
        redirect("/login?returnUrl=/profile");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // In a real implementation, you would call an API to update the user's profile
            // await fetch('/api/profile', {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData),
            // });

            // For now, just simulate a delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Summary */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center">
                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                            {session?.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-12 w-12 text-gray-500" />
                            )}
                        </div>
                        <h2 className="text-xl font-bold">{session?.user?.name || "User"}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{session?.user?.email || "No email provided"}</p>

                        <div className="mt-6 space-y-2 w-full">
                            <div className="flex items-center text-sm">
                                <Building className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Citizen</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Constituency: {formData.constituency}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Details */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Enter your full name"
                                            className="pl-10"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="pl-10"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="constituency">Constituency</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <select
                                            id="constituency"
                                            name="constituency"
                                            className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2"
                                            value={formData.constituency}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        >
                                            <option value="Not set">Select your constituency</option>
                                            <option value="Kingston Central">Kingston Central</option>
                                            <option value="St. Andrew Western">St. Andrew Western</option>
                                            <option value="Clarendon Northern">Clarendon Northern</option>
                                            {/* In a real implementation, this would be populated from the API */}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-4">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Additional sections could be added here */}
                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <div>
                                    <h3 className="font-medium">Email Notifications</h3>
                                    <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                                </div>
                                <div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pb-4 border-b">
                                <div>
                                    <h3 className="font-medium">Two-Factor Authentication</h3>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Enable
                                </Button>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-red-600">Delete Account</h3>
                                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                                </div>
                                <Button variant="destructive" size="sm">
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}