"use client"

import { useState, useEffect, useRef } from "react"
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

export interface MediaContent {
    cover?: string
    title?: string
    description?: string
    track?: string
    artist?: string
    type?: string
}

interface EditMediaDialogProps {
    tile?: Tile
    open: boolean
    onOpenChange: (open: boolean) => void
    initialContent?: MediaContent
    onSave?: (content: MediaContent) => void
}

export function EditMediaDialog({ tile, open, onOpenChange, initialContent, onSave }: EditMediaDialogProps) {
    const { updateTile } = useLayoutStore()
    const content = tile?.content || initialContent || {}

    const [cover, setCover] = useState(content.cover || "")
    const [title, setTitle] = useState(content.title || "")
    const [description, setDescription] = useState(content.description || "")
    const [type, setType] = useState(content.type || "Image")

    const titleInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (open) {
            const currentContent = tile?.content || initialContent || {}

            setCover(currentContent.cover || "")
            setTitle(currentContent.title || "")
            setDescription(currentContent.description || "")
            setType(currentContent.type || "Image")

            setTimeout(() => {
                titleInputRef.current?.focus()
            }, 100)
        }
    }, [open])


    const [isUploading, setIsUploading] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)

        // Determine type based on file
        if (file.type.startsWith('video/')) {
            setType("Video")
        } else {
            setType("Image")
        }

        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
            const data = await res.json()
            if (data.url) {
                setCover(data.url)
            }
        } catch (error) {
            console.error("Upload error:", error)
        } finally {
            setIsUploading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newContent = {
            ...content,
            cover,
            title,
            description,
            type
        }

        if (onSave) {
            onSave(newContent)
        } else if (tile) {
            updateTile(tile.id, {
                ...tile,
                content: newContent
            })
        }

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Media</DialogTitle>
                    <DialogDescription>
                        Update the title, description, and cover image.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                ref={titleInputRef}
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3"
                                placeholder="Video Title"
                                onPointerDown={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                                placeholder="Short description"
                                onPointerDown={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cover" className="text-right">
                                Cover URL
                            </Label>
                            <div className="col-span-3 flex flex-col gap-2">
                                <Input
                                    id="cover"
                                    value={cover}
                                    onChange={(e) => setCover(e.target.value)}
                                    placeholder="https://..."
                                    onPointerDown={(e) => e.stopPropagation()}
                                />
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">OR Upload</span>
                                    <Input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                        className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-zinc-800 dark:file:text-zinc-200"
                                    />
                                </div>
                                {isUploading && <span className="text-xs text-blue-500">Uploading...</span>}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isUploading}>
                            {isUploading ? "Uploading..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
