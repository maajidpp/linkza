import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { BentoGrid } from "@/components/grid/bento-grid"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AddBlockSheet } from "@/components/modules/add-block-sheet"
import { DashboardHeader } from "@/components/modules/dashboard-header"
import Link from "next/link"
import { DeviceGuard } from "@/components/modules/device-guard"

export default async function DashboardPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <DeviceGuard>
            <div className="min-h-screen bg-background p-8 font-sans">
                <DashboardHeader user={session.user} />

                <main className="mx-auto max-w-[1400px] relative min-h-[500px]">
                    <BentoGrid />
                </main>

                {/* We need to ensure AddBlockSheet only shows in Edit Mode, which is state-driven. 
              The component handles its own visibility based on store, or we check here? 
              The store is client-side. AddBlockSheet uses store. 
              We'll add a Client Wrapper for the Edit/Sheet logic since this page is Server Component?
              Actually, BentoGrid is client, AddBlockSheet is client.
          */}
                <ClientEditWrapper />
            </div>
        </DeviceGuard>
    )
}

function ClientEditWrapper() {
    return (
        <EditWrapperComponent />
    )
}

import { EditWrapperComponent } from "@/components/modules/edit-wrapper"
