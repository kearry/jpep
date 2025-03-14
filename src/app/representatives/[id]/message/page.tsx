import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MessageForm from "@/components/representatives/message-form";
import { getRepresentativeById } from "@/services/representative-service";
import { ChevronLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: { id: string } }) {
    const representative = await getRepresentativeById(params.id);

    if (!representative) {
        return {
            title: "Representative Not Found | Jamaica Political Engagement Platform",
        };
    }

    return {
        title: `Message ${representative.title} ${representative.user.name} | Jamaica Political Engagement Platform`,
        description: `Send a message to ${representative.title} ${representative.user.name}, representative for ${representative.constituency.name}`,
    };
}

export default async function RepresentativeMessagePage({
    params,
}: {
    params: { id: string };
}) {
    const representative = await getRepresentativeById(params.id);

    if (!representative) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" asChild className="mr-4">
                    <Link href={`/representatives/${params.id}`}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Representative Profile
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Message {representative.user.name}</h1>
            </div>

            <MessageForm representative={representative} />
        </div>
    );
}