import { NextResponse } from "next/server"
import { User } from "@/lib/models/user"
import dbConnect from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .regex(/^[a-z0-9-]+$/, "Username can only contain lowercase letters, numbers, and hyphens"),
})

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"

        if (!rateLimit(ip).success) {
            return NextResponse.json(
                { message: "Too many requests. Please try again later." },
                { status: 429 }
            )
        }

        const body = await req.json()
        const parsedBody = registerSchema.safeParse(body)

        if (!parsedBody.success) {
            return NextResponse.json(
                { message: "Invalid input", errors: parsedBody.error.flatten() },
                { status: 400 }
            )
        }

        const { name, email, password, username } = parsedBody.data

        await dbConnect()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists with this email" },
                { status: 400 }
            )
        }

        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            return NextResponse.json(
                { message: "Username is already taken" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            username,
            isUsernameSet: true,
            role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
        })

        return NextResponse.json(
            { message: "User created successfully", user: { id: user._id, name: user.name, email: user.email, username: user.username } },
            { status: 201 }
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
