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

interface EditHeadingDialogProps {
    tile: Tile
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditHeadingDialog({ tile, open, onOpenChange }: EditHeadingDialogProps) {
    const { updateTile } = useLayoutStore()
    const content = tile.content

    const [text, setText] = useState(content.text || "")

    useEffect(() => {
        if (open) {
            setText(content.text || "")
        }
    }, [open, content])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateTile(tile.id, {
            ...tile,
            content: {
                ...tile.content,
                text
            }
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Heading</DialogTitle>
                    <DialogDescription>
                        Update the section heading text.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="text" className="text-right">
                                Heading
                            </Label>
                            <Input
                                id="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="col-span-3"
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
