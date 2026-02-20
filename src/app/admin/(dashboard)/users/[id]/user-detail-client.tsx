"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Trash2, Ban, CheckCircle, Save } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface User {
    _id: string
    name: string
    email: string
    username?: string
    role: string
    status: string
}

export default function UserDetailActions({ user }: { user: User }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    })

    const handleUpdate = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/users/${user._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Failed to update user")

            toast.success("User updated successfully")
            router.refresh()
            setIsEditing(false)
        } catch (error) {
            toast.error("Error updating user")
            console.error(error)
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
            router.push("/admin/users")
            router.refresh()
        } catch (error) {
            toast.error("Error deleting user")
            console.error(error)
            setIsLoading(false) // Only reset loading on error, otherwise we navigate away
        }
    }

    const toggleStatus = async () => {
        const newStatus = formData.status === "active" ? "suspended" : "active"
        setFormData(prev => ({ ...prev, status: newStatus }))

        // Immediate save for status toggle
        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/users/${user._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, status: newStatus }),
            })
            if (!res.ok) throw new Error("Failed to update status")
            toast.success(`User ${newStatus === "active" ? "activated" : "suspended"}`)
            router.refresh()
        } catch (error) {
            toast.error("Error updating status")
            // Revert on error
            setFormData(prev => ({ ...prev, status: user.status }))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-x-2">
                    <Button
                        variant={formData.status === "active" ? "destructive" : "default"}
                        onClick={toggleStatus}
                        disabled={isLoading}
                    >
                        {formData.status === "active" ? (
                            <>
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend User
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate User
                            </>
                        )}
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete the user account and user data.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => { }}>Cancel</Button>
                                <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
                    {isEditing ? "Cancel Edit" : "Edit Details"}
                </Button>
            </div>

            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={!isEditing} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input id="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={!isEditing} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">Role</Label>
                    <Select onValueChange={val => setFormData({ ...formData, role: val })} value={formData.role} disabled={!isEditing}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isEditing && (
                <div className="flex justify-end">
                    <Button onClick={handleUpdate} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            )}
        </div>
    )
}
