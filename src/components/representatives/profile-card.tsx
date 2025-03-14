import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RepresentativeType } from "@/types";
import { getPartyInfo, formatDate } from "@/lib/utils";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

interface ProfileCardProps {
    representative: RepresentativeType;
    showActions?: boolean;
}

export default function ProfileCard({ representative, showActions = true }: ProfileCardProps) {
    const { user, title, party, biography, phoneNumber, officeAddress, website, constituency } = representative;
    const { name, image } = user;
    const partyInfo = getPartyInfo(party);

    return (
        <Card className="overflow-hidden">
            <div className={`h-3 w-full ${partyInfo.color.split(' ')[0]}`}></div>
            <CardHeader className="flex flex-col items-center pt-6">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow">
                    {image ? (
                        <Image
                            src={image}
                            alt={name || "Representative"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xl font-semibold text-gray-500">
                                {name ? name.charAt(0).toUpperCase() : "R"}
                            </span>
                        </div>
                    )}
                </div>
                <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold">{title} {name}</h2>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${partyInfo.color}`}>
                        {partyInfo.name}
                    </div>
                    <p className="text-sm mt-2">
                        Representative for{" "}
                        <Link href={`/constituencies/${representative.constituencyId}`} className="font-medium hover:underline">
                            {constituency.name}, {constituency.parish}
                        </Link>
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {biography && (
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Biography</h3>
                        <p className="text-sm text-gray-600">{biography}</p>
                    </div>
                )}

                <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold mb-2">Contact Information</h3>
                    <ul className="space-y-2">
                        {phoneNumber && (
                            <li className="flex items-center text-sm">
                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                <a href={`tel:${phoneNumber}`} className="hover:underline">
                                    {phoneNumber}
                                </a>
                            </li>
                        )}
                        {user.email && (
                            <li className="flex items-center text-sm">
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                <a href={`mailto:${user.email}`} className="hover:underline">
                                    {user.email}
                                </a>
                            </li>
                        )}
                        {website && (
                            <li className="flex items-center text-sm">
                                <Globe className="h-4 w-4 mr-2 text-gray-400" />
                                <a href={website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {website.replace(/^https?:\/\//, '')}
                                </a>
                            </li>
                        )}
                        {officeAddress && (
                            <li className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{officeAddress}</span>
                            </li>
                        )}
                    </ul>
                </div>

                {showActions && (
                    <div className="flex flex-col space-y-2 pt-4 border-t">
                        <Button asChild>
                            <Link href={`/representatives/${representative.id}/message`}>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Message
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/representatives/${representative.id}`}>
                                View Full Profile
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}