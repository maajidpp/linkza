import { auth } from "@/auth";
import { User } from "@/lib/models/user";
import dbConnect from "@/lib/db";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserFilters, UserPagination } from "./components";
import { UserTableActions } from "./user-table-actions";
import { Search } from "lucide-react";

export default async function UserListPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
        redirect("/login");
    }

    const resolvedSearchParams = await searchParams;
    const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1;
    const limit = typeof resolvedSearchParams.limit === "string" ? parseInt(resolvedSearchParams.limit) : 10;
    const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "";
    const status = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : "";

    await dbConnect();

    const query: any = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
        ];
    }
    if (status && status !== "all") {
        query.status = status;
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">User Management</h2>
                    <p className="text-muted-foreground text-sm">
                        View and manage user accounts, roles, and status.
                    </p>
                </div>
            </div>

            <Card className="border-border/40 shadow-sm">
                <CardHeader className="pb-4">
                    <UserFilters />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b bg-muted/30">
                                <tr className="border-b transition-colors data-[state=selected]:bg-muted">
                                    <th className="h-10 px-4 align-middle font-medium text-muted-foreground">User</th>
                                    <th className="h-10 px-4 align-middle font-medium text-muted-foreground">Role</th>
                                    <th className="h-10 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-10 px-4 align-middle font-medium text-muted-foreground">Joined</th>
                                    <th className="h-10 px-4 align-middle font-medium text-muted-foreground">Last Active</th>
                                    <th className="h-10 px-4 align-middle font-medium text-muted-foreground text-right w-[50px]"></th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0 bg-background">
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted group">
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                                {user.username && <span className="text-xs text-muted-foreground font-mono mt-0.5">@{user.username}</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${user.role === "admin"
                                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                                    : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                                                }`}>
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${user.status === "active"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                }`}>
                                                {user.status === "active" ? (
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                                        Active
                                                    </span>
                                                ) : "Suspended"}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            }) : <span className="text-zinc-400 italic">Never</span>}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <UserTableActions user={{
                                                _id: user._id.toString(),
                                                name: user.name,
                                                email: user.email,
                                                username: user.username,
                                                role: user.role,
                                                status: user.status
                                            }} />
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="p-3 rounded-full bg-muted">
                                                    <Search className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <h3 className="font-semibold text-lg">No users found</h3>
                                                <p className="text-sm max-w-[200px]">
                                                    Try adjusting your search or filters to find what you're looking for.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                <div className="p-4 border-t border-border/40">
                    <UserPagination totalPages={totalPages} currentPage={page} />
                </div>
            </Card>
        </div>
    );
}
