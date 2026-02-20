"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Ban, Trash2, CheckCircle, Eye } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface UserTableActionsProps {
    user: {
        _id: string
        name: string
        email: string
        username?: string
        role: string
        status: string
    }
}

export function UserTableActions({ user }: UserTableActionsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const toggleStatus = async () => {
        const newStatus = user.status === "active" ? "suspended" : "active"
        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/users/${user._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!res.ok) throw new Error("Failed to update status")

            toast.success(`User ${newStatus === "active" ? "activated" : "suspended"}`)
            router.refresh()
        } catch (error) {
            toast.error("Error updating status")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/users/${user._id}`, {
                method: "DELETE",
            })

            if (!res.ok) throw new Error("Failed to delete user")

            toast.success("User deleted successfully")
            setShowDeleteDialog(false)
            router.refresh()
        } catch (error) {
            toast.error("Error deleting user")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user._id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user._id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit User
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                        e.preventDefault()
                        toggleStatus()
                    }} disabled={isLoading}>
                        {user.status === "active" ? (
                            <>
                                <Ban className="mr-2 h-4 w-4 text-orange-500" />
                                <span className="text-orange-500">Suspend User</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                <span className="text-green-500">Activate User</span>
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault()
                        setShowDeleteDialog(true)
                    }} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete <b>{user.name}</b> and all their data (widgets, settings, etc). This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
