import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-JM", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function formatDateTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-JM", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function truncate(str: string, length: number): string {
    return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-JM", {
        style: "currency",
        currency: "JMD",
    }).format(amount);
}

export function getInitials(name: string): string {
    if (!name) return "";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

export function formatNumber(number: number): string {
    return new Intl.NumberFormat("en-JM").format(number);
}

// Function to calculate time ago (e.g., "2 hours ago")
export function timeAgo(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} year${years === 1 ? "" : "s"} ago`;
    if (months > 0) return `${months} month${months === 1 ? "" : "s"} ago`;
    if (days > 0) return `${days} day${days === 1 ? "" : "s"} ago`;
    if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    if (minutes > 0) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    return "just now";
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

// Get status color based on value
export function getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
        ACTIVE: "bg-green-100 text-green-800",
        COMPLETED: "bg-blue-100 text-blue-800",
        EXPIRED: "bg-gray-100 text-gray-800",
        INTRODUCED: "bg-blue-100 text-blue-800",
        IN_COMMITTEE: "bg-yellow-100 text-yellow-800",
        PASSED_HOUSE: "bg-purple-100 text-purple-800",
        PASSED_SENATE: "bg-indigo-100 text-indigo-800",
        ENACTED: "bg-green-100 text-green-800",
        DEFEATED: "bg-red-100 text-red-800",
        PROPOSED: "bg-gray-100 text-gray-800",
        APPROVED: "bg-blue-100 text-blue-800",
        IN_PROGRESS: "bg-yellow-100 text-yellow-800",
        CANCELLED: "bg-red-100 text-red-800",
        DEFAULT: "bg-gray-100 text-gray-800",
    };

    return statusColors[status] || statusColors.DEFAULT;
}

// Format party name and return color
export function getPartyInfo(party: string): { name: string; color: string } {
    const partyInfo: Record<string, { name: string; color: string }> = {
        JLP: {
            name: "Jamaica Labour Party",
            color: "bg-green-100 text-green-800",
        },
        PNP: {
            name: "People's National Party",
            color: "bg-orange-100 text-orange-800",
        },
        IND: {
            name: "Independent",
            color: "bg-gray-100 text-gray-800",
        },
    };

    return partyInfo[party] || { name: party, color: "bg-gray-100 text-gray-800" };
}