"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLayoutStore, Tile } from "@/lib/store/use-layout-store"

interface EditMapDialogProps {
    tile?: Tile
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditMapDialog({ tile, open, onOpenChange }: EditMapDialogProps) {
    const { updateTile } = useLayoutStore()
    const [location, setLocation] = useState(tile?.content?.location || "")

    useEffect(() => {
        if (open) {
            setLocation(tile?.content?.location || "")
        }
    }, [open, tile])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (tile) {
            updateTile(tile.id, {
                ...tile,
                content: {
                    ...tile.content,
                    location
                }
            })
        }
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Location</DialogTitle>
                    <DialogDescription>
                        Enter the location you want to display on the map.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right">
                                Location
                            </Label>
                            <Input
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g. New York, NY"
                                autoFocus
                                onPointerDown={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
