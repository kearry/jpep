import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
    sendMessage,
    getInboxMessages,
    getSentMessages,
    getUnreadMessageCount,
    markAllMessagesAsRead
} from "@/services/message-service";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get("type") || "inbox";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const countOnly = searchParams.has("count");
        const markRead = searchParams.has("markRead");

        if (countOnly) {
            // Get unread message count
            const count = await getUnreadMessageCount(session.user.id);
            return NextResponse.json({ count });
        }

        if (markRead) {
            // Mark all messages as read
            const count = await markAllMessagesAsRead(session.user.id);
            return NextResponse.json({ markedAsRead: count });
        }

        // Get messages based on type
        let result;

        if (type === "sent") {
            result = await getSentMessages(session.user.id, page, limit);
        } else {
            result = await getInboxMessages(session.user.id, page, limit);
        }

        return NextResponse.json({
            messages: result.messages,
            total: result.total,
            page,
            limit,
            totalPages: Math.ceil(result.total / limit),
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { recipientId, subject, content } = await request.json();

        // Validate input
        if (!recipientId || !subject || !content) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Send message
        const message = await sendMessage(
            session.user.id,
            recipientId,
            subject,
            content
        );

        return NextResponse.json({ message }, { status: 201 });
    } catch (error: any) {
        console.error("Error sending message:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send message" },
            { status: 500 }
        );
    }
}