import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/lib/models/user";
import dbConnect from "@/lib/db";

export async function GET(req: Request) {
    try {
        const session = await auth();
        // Check for admin role
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status");

        await dbConnect();

        const query: any = {};

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by status
        if (status && status !== "all") {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const users = await User.find(query)
            .select("-password") // Exclude password from response
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        return NextResponse.json({
            users,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
