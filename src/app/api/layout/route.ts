import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { Layout } from "@/lib/models/layout"
import { User } from "@/lib/models/user"
import { auth } from "@/auth"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const username = searchParams.get("username")

        await dbConnect()

        let userId

        if (username) {
            // Public fetch by username
            const user = await User.findOne({ username })
            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 })
            }
            userId = user._id
        } else {
            // Authenticated fetch for current user
            const session = await auth()
            if (!session || !session.user) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
            }
            userId = session.user.id
        }

        const layout = await Layout.findOne({ userId })

        if (!layout) {
            return NextResponse.json({ tiles: [] })
        }

        return NextResponse.json(layout)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { tiles } = await req.json()
        await dbConnect()

        const layout = await Layout.findOneAndUpdate(
            { userId: session.user.id },
            { tiles, userId: session.user.id }, // Ensure userId is set on creation
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )

        return NextResponse.json(layout)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
