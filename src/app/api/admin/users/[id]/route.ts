import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/lib/models/user";
import { Session } from "@/lib/models/session";
import { Layout } from "@/lib/models/layout";
import dbConnect from "@/lib/db";

// Helper for auth check
async function checkAdmin() {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
        return false;
    }
    return true;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await checkAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    try {
        await dbConnect();
        const user = await User.findById(id).select("-password").lean();
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Count widgets (tiles) across all layouts
        const layouts = await Layout.find({ userId: id });
        const widgetCount = layouts.reduce((acc, layout) => acc + (layout.tiles?.length || 0), 0);

        return NextResponse.json({ ...user, widgetCount });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await checkAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    try {
        const body = await req.json();
        const { role, status, name, email } = body;

        await dbConnect();

        // Prevent modifying own role/status to avoid locking oneself out (optional but good practice)
        // const session = await auth();
        // if (session?.user?.id === id && (role || status === 'suspended')) {
        //     return NextResponse.json({ message: "Cannot modify your own role or status" }, { status: 400 });
        // }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role, status, name, email },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // If user is suspended, revoke all their sessions
        if (status === "suspended") {
            await Session.updateMany({ userId: id }, { isRevoked: true });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await checkAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    try {
        await dbConnect();

        // Prevent deleting self
        const session = await auth();
        if (session?.user?.id === id) {
            return NextResponse.json({ message: "Cannot delete your own account" }, { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Cleanup related data
        await Session.deleteMany({ userId: id });
        await Layout.deleteMany({ userId: id });

        return NextResponse.json({ message: "User and related data deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
