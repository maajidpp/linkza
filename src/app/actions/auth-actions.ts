"use server"

import { auth, signOut } from "@/auth"
import dbConnect from "@/lib/db"
import { Session } from "@/lib/models/session"
import { revalidatePath } from "next/cache"

export async function logout() {
    const session = await auth()
    if (session?.sessionId) {
        await dbConnect()
        await Session.findByIdAndUpdate(session.sessionId, { isRevoked: true })
    }
    await signOut({ redirectTo: "/login" })
}

export async function revokeAllSessions() {
    const session = await auth()
    if (!session?.user?.id) return { error: "Not authenticated" }

    await dbConnect()
    await Session.updateMany(
        { userId: session.user.id, isRevoked: false },
        { isRevoked: true }
    )

    revalidatePath("/dashboard/settings")
    return { success: true }
}

export async function revokeSession(sessionId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Not authenticated" }

    await dbConnect()
    // Ensure the session belongs to the current user before revoking
    await Session.findOneAndUpdate(
        { _id: sessionId, userId: session.user.id },
        { isRevoked: true }
    )

    revalidatePath("/dashboard/settings")
    return { success: true }
}

export async function getActiveSessions() {
    const session = await auth()
    if (!session?.user?.id) return []

    await dbConnect()
    const sessions = await Session.find({
        userId: session.user.id,
        isRevoked: false,
        expiresAt: { $gt: new Date() }
    }).sort({ lastActive: -1 })

    // Serialize for client component
    return sessions.map(s => ({
        id: s._id.toString(),
        ipAddress: s.ipAddress,
        userAgent: s.userAgent,
        lastActive: s.lastActive,
        isCurrent: s._id.toString() === session.sessionId
    }))
}
