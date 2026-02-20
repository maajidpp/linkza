"use client"

import { useLayoutStore } from "@/lib/store/use-layout-store"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { logout } from "@/app/actions/auth-actions"
import Link from "next/link"

export function DashboardHeader({ user }: { user: any }) {
    const { isEditMode, setEditMode } = useLayoutStore()

    return (
        <header className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Pathayam</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name || "User"}.</p>
            </div>
            <div className="flex items-center gap-4">
                <Link href={`/${user?.username}`} target="_blank">
                    <Button variant="ghost" size="sm">View Public</Button>
                </Link>
                {user?.role === "admin" && (
                    <Link href="/admin">
                        <Button variant="outline" size="sm">Admin Panel</Button>
                    </Link>
                )}
                <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-full px-4">
                    <Switch
                        id="edit-mode"
                        checked={isEditMode}
                        onCheckedChange={setEditMode}
                    />
                    <Label htmlFor="edit-mode" className="cursor-pointer">Edit Mode</Label>
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                            await logout()
                        }}
                    >
                        Log out
                    </Button>
                </div>
            </div>
        </header>
    )
}
