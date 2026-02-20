import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, LayoutDashboard, LogOut, ShieldAlert } from "lucide-react";
import { headers } from "next/headers";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    if (isMobile) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background p-4 text-center">
                <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2">Desktop Access Only</h1>
                <p className="text-muted-foreground max-w-md">
                    The BentoAI Admin Panel is restricted to desktop devices for security and usability reasons.
                    Please access this page from a computer.
                </p>
                <Link href="/dashboard">
                    <Button variant="outline" className="mt-6">
                        Return to Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold">BentoAI Admin</h1>
                <p className="text-xs text-muted-foreground mt-1">
                    {session?.user?.email}
                </p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <Link href="/admin">
                    <Button variant="ghost" className="w-full justify-start">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Button>
                </Link>
                <Link href="/admin/users">
                    <Button variant="ghost" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        Users
                    </Button>
                </Link>
            </nav>
            <div className="p-4 border-t">
                <form
                    action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/admin/login" });
                    }}
                >
                    <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden absolute top-4 left-4 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 md:p-12 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
