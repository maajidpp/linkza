import { NextResponse } from "next/server"
import { User } from "@/lib/models/user"
import dbConnect from "@/lib/db"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const username = searchParams.get("username")

        if (!username) {
            return NextResponse.json(
                { message: "Username is required" },
                { status: 400 }
            )
        }

        // Basic validation: lowercase, numbers, hyphens, min 3 chars
        const usernameRegex = /^[a-z0-9-]{3,}$/
        if (!usernameRegex.test(username)) {
            return NextResponse.json(
                { available: false, message: "Invalid username format" },
                { status: 200 }
            )
        }

        await dbConnect()

        const user = await User.findOne({ username })

        if (user) {
            return NextResponse.json(
                { available: false, message: "Username is already taken" },
                { status: 200 }
            )
        }

        return NextResponse.json(
            { available: true, message: "Username is available" },
            { status: 200 }
        )

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
