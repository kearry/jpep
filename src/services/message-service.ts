import prisma from "@/lib/prisma";
import { MessageType } from "@/types";

/**
 * Send a message from a user to a representative
 */
export async function sendMessage(senderId: string, recipientId: string, subject: string, content: string) {
    // Verify the recipient is a representative
    const recipient = await prisma.user.findFirst({
        where: {
            id: recipientId,
            OR: [
                { role: "REPRESENTATIVE" },
                { role: "STAFF" },
            ],
        },
    });

    if (!recipient) {
        throw new Error("Recipient is not a valid representative or staff member");
    }

    const message = await prisma.message.create({
        data: {
            subject,
            content,
            sender: {
                connect: {
                    id: senderId,
                },
            },
            recipient: {
                connect: {
                    id: recipientId,
                },
            },
        },
        include: {
            sender: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
            recipient: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });

    return message;
}

/**
 * Get all messages sent to a user
 */
export async function getInboxMessages(userId: string, page = 1, limit = 10): Promise<{ messages: MessageType[], total: number }> {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
        prisma.message.findMany({
            where: {
                recipientId: userId,
            },
            include: {
                sender: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                recipient: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),
        prisma.message.count({
            where: {
                recipientId: userId,
            },
        }),
    ]);

    return {
        messages: messages as unknown as MessageType[],
        total,
    };
}

/**
 * Get all messages sent by a user
 */
export async function getSentMessages(userId: string, page = 1, limit = 10): Promise<{ messages: MessageType[], total: number }> {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
        prisma.message.findMany({
            where: {
                senderId: userId,
            },
            include: {
                sender: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                recipient: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),
        prisma.message.count({
            where: {
                senderId: userId,
            },
        }),
    ]);

    return {
        messages: messages as unknown as MessageType[],
        total,
    };
}

/**
 * Get a message by ID
 */
export async function getMessageById(id: string, userId: string): Promise<MessageType | null> {
    const message = await prisma.message.findFirst({
        where: {
            id,
            OR: [
                { senderId: userId },
                { recipientId: userId },
            ],
        },
        include: {
            sender: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
            recipient: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });

    if (!message) {
        return null;
    }

    // Mark as read if the user is the recipient and it's unread
    if (message.recipientId === userId && !message.read) {
        await prisma.message.update({
            where: { id },
            data: { read: true },
        });
    }

    return message as unknown as MessageType;
}

/**
 * Delete a message
 */
export async function deleteMessage(id: string, userId: string): Promise<boolean> {
    // First, verify the user owns this message
    const message = await prisma.message.findFirst({
        where: {
            id,
            OR: [
                { senderId: userId },
                { recipientId: userId },
            ],
        },
    });

    if (!message) {
        return false;
    }

    // Delete the message
    await prisma.message.delete({
        where: { id },
    });

    return true;
}

/**
 * Get unread message count for a user
 */
export async function getUnreadMessageCount(userId: string): Promise<number> {
    const count = await prisma.message.count({
        where: {
            recipientId: userId,
            read: false,
        },
    });

    return count;
}

/**
 * Mark all messages as read for a user
 */
export async function markAllMessagesAsRead(userId: string): Promise<number> {
    const result = await prisma.message.updateMany({
        where: {
            recipientId: userId,
            read: false,
        },
        data: {
            read: true,
        },
    });

    return result.count;
}

/**
 * Reply to a message
 */
export async function replyToMessage(
    originalMessageId: string,
    senderId: string,
    content: string
): Promise<MessageType> {
    // Get the original message
    const originalMessage = await prisma.message.findUnique({
        where: { id: originalMessageId },
        select: {
            subject: true,
            recipientId: true,
            senderId: true,
        },
    });

    if (!originalMessage) {
        throw new Error("Original message not found");
    }

    // Make sure the user was part of the original conversation
    if (originalMessage.recipientId !== senderId && originalMessage.senderId !== senderId) {
        throw new Error("You are not authorized to reply to this message");
    }

    // Determine the recipient (the other party in the conversation)
    const recipientId = originalMessage.senderId === senderId
        ? originalMessage.recipientId
        : originalMessage.senderId;

    // Create the reply with "Re: " prefix if not already present
    const subject = originalMessage.subject.startsWith("Re: ")
        ? originalMessage.subject
        : `Re: ${originalMessage.subject}`;

    const reply = await prisma.message.create({
        data: {
            subject,
            content,
            sender: {
                connect: { id: senderId },
            },
            recipient: {
                connect: { id: recipientId },
            },
        },
        include: {
            sender: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
            recipient: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });

    return reply as unknown as MessageType;
}