import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserSessions } from "@/components/auth/user-sessions"
import { DeviceGuard } from "@/components/modules/device-guard"
import { DashboardHeader } from "@/components/modules/dashboard-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function SettingsPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <DeviceGuard>
            <div className="min-h-screen bg-background p-8 font-sans">
                <DashboardHeader user={session.user} />

                <main className="mx-auto max-w-4xl mt-8">
                    <div className="mb-8 flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold mb-4">Device Management</h2>
                            <UserSessions />
                        </section>
                    </div>
                </main>
            </div>
        </DeviceGuard>
    )
}
