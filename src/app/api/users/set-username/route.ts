import { NextResponse } from "next/server"
import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import { User } from "@/lib/models/user"
import { z } from "zod"

const setUsernameSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(/^[a-z0-9-]+$/, "Username can only contain lowercase letters, numbers, and hyphens")
        .refine(val => !["admin", "login", "dashboard", "api", "register", "choose-username"].includes(val), "This username is reserved"),
})

export async function PATCH(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        if ((session.user as any).isUsernameSet) {
            return NextResponse.json({ message: "Username already set" }, { status: 400 })
        }

        const body = await req.json()
        const parsed = setUsernameSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.errors[0].message },
                { status: 400 }
            )
        }

        const { username } = parsed.data
        await dbConnect()

        // Check uniqueness
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return NextResponse.json({ message: "Username already taken" }, { status: 400 })
        }

        // Update user
        await User.findByIdAndUpdate(session.user.id, {
            username,
            isUsernameSet: true
        })

        return NextResponse.json({ message: "Username set successfully" })

    } catch (error) {
        console.error("Error setting username:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
