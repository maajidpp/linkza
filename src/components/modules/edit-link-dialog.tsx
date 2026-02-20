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

import { useDebounce } from "@/lib/hooks/use-debounce"

interface EditLinkDialogProps {
    tile: Tile
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditLinkDialog({ tile, open, onOpenChange }: EditLinkDialogProps) {
    const { updateTile } = useLayoutStore()
    const content = tile.content

    const [label, setLabel] = useState(content.label || "")
    const [description, setDescription] = useState(content.description || "")
    const [url, setUrl] = useState(content.url || "")
    const [previewImage, setPreviewImage] = useState(content.previewImage || "")
    const [isLoadingPreview, setIsLoadingPreview] = useState(false)
    const [fetchKey, setFetchKey] = useState(0)

    const debouncedUrl = useDebounce(url, 500)

    useEffect(() => {
        if (open) {
            setLabel(content.label || "")
            setDescription(content.description || "")
            setUrl(content.url || "")
            setPreviewImage(content.previewImage || "")
            // Increment fetchKey to force fetch to re-run after reset
            setFetchKey(k => k + 1)
        }
    }, [open, content])

    // Auto-fetch preview when debounced URL changes or dialog opens
    useEffect(() => {
        const fetchPreview = async () => {
            if (!debouncedUrl || !debouncedUrl.startsWith("http")) return

            setIsLoadingPreview(true)
            try {
                const res = await fetch(`/api/link-preview?url=${encodeURIComponent(debouncedUrl)}`)
                const data = await res.json()

                if (data.image) setPreviewImage(data.image)
                if (data.title) setDescription(data.title)
            } catch (error) {
                console.error("Failed to fetch preview:", error)
            } finally {
                setIsLoadingPreview(false)
            }
        }

        fetchPreview()
    }, [debouncedUrl, fetchKey])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateTile(tile.id, {
            ...tile,
            content: {
                ...tile.content,
                label,
                description,
                url,
                previewImage
            }
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Link</DialogTitle>
                    <DialogDescription>
                        Update the link label, description, and URL.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                                URL
                            </Label>
                            <Input
                                id="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="col-span-3"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="label" className="text-right">
                                Label
                            </Label>
                            <Input
                                id="label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="col-span-3"
                                placeholder="Link Title"
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
                                onKeyDown={(e) => e.stopPropagation()}
                                className="col-span-3"
                                placeholder="Short description (optional)"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="preview" className="text-right">
                                Preview Image
                            </Label>
                            <div className="col-span-3 flex gap-2">
                                <Input
                                    id="preview"
                                    value={previewImage}
                                    onChange={(e) => setPreviewImage(e.target.value)}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    placeholder="Image URL (auto-fetched)"
                                />
                                {isLoadingPreview && <span className="text-sm text-muted-foreground flex items-center">Loading...</span>}
                            </div>
                        </div>
                        {previewImage && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <div className="col-start-2 col-span-3">
                                    <img src={previewImage} alt="Preview" className="h-20 w-auto rounded-md object-cover border" />
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
