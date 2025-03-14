"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RepresentativeType } from "@/types";
import { AlertCircle, Send, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface MessageFormProps {
    representative: RepresentativeType;
}

export default function MessageForm({ representative }: MessageFormProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session?.user) {
            setError("You must be logged in to send a message");
            return;
        }

        if (!subject.trim() || !message.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipientId: representative.userId,
                    subject,
                    content: message,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to send message");
            }

            setSuccess(true);
            setSubject("");
            setMessage("");

            // Redirect to sent messages after a delay
            setTimeout(() => {
                router.push("/messages/sent");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "An error occurred while sending your message");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Send Message to {representative.user.name}</CardTitle>
                <CardDescription>
                    Your message will be sent directly to the representative's office.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md mb-4">
                        Your message was sent successfully! Redirecting to your sent messages...
                    </div>
                )}

                {!session?.user ? (
                    <div className="text-center py-6">
                        <p className="mb-4">You need to be logged in to send a message to a representative.</p>
                        <Button
                            onClick={() => router.push(`/login?returnUrl=/representatives/${representative.id}/message`)}
                        >
                            Sign In to Continue
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    placeholder="Enter the subject of your message"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <textarea
                                    id="message"
                                    className="w-full min-h-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Enter your message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                ></textarea>
                                <p className="text-xs text-gray-500">
                                    Please be respectful and specific about your concerns or questions.
                                </p>
                            </div>
                        </div>
                    </form>
                )}
            </CardContent>
            {session?.user && (
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !subject.trim() || !message.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Message
                            </>
                        )}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}