import { Layout } from "@/lib/models/layout";
import { Grid, Clock, ArrowLeft, ExternalLink, Calendar, Mail, User as UserIcon, CheckCircle } from "lucide-react";
import { auth } from "@/auth";
import { User } from "@/lib/models/user";
import dbConnect from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import UserDetailActions from "./user-detail-client";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
        redirect("/login");
    }

    await dbConnect();
    const user = await User.findById(id).select("-password").lean();

    if (!user) {
        notFound();
    }

    // Count widgets (tiles) across all layouts
    const layouts = await Layout.find({ userId: id });
    const widgetCount = layouts.reduce((acc, layout) => acc + (layout.tiles?.length || 0), 0);

    // Convert _id to string for avoiding serialization issues with Client Components
    const serializedUser = {
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
        lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/admin/users">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Basic user information and account status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 border rounded-lg bg-muted/50">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{user.name}</h3>
                                {user.username && <p className="text-sm text-muted-foreground">@{user.username}</p>}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="flex items-center text-muted-foreground"><Mail className="mr-2 h-4 w-4" /> Email</span>
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="flex items-center text-muted-foreground"><UserIcon className="mr-2 h-4 w-4" /> Role</span>
                                <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="flex items-center text-muted-foreground"><CheckCircle className="mr-2 h-4 w-4" /> Status</span>
                                <Badge variant={user.status === "active" ? "outline" : "destructive"}>{user.status}</Badge>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="flex items-center text-muted-foreground"><Calendar className="mr-2 h-4 w-4" /> Joined</span>
                                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="flex items-center text-muted-foreground"><Clock className="mr-2 h-4 w-4" /> Last Login</span>
                                <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="flex items-center text-muted-foreground"><Grid className="mr-2 h-4 w-4" /> Total Widgets</span>
                                <Badge variant="outline">{widgetCount}</Badge>
                            </div>
                        </div>

                        {user.username && (
                            <div className="pt-4">
                                <Link href={`/${user.username}`} target="_blank">
                                    <Button variant="outline" className="w-full">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        View Public Profile
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Actions & Settings</CardTitle>
                        <CardDescription>Manage this user account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserDetailActions user={serializedUser as any} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
