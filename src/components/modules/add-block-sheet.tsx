"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useLayoutStore, TileType } from "@/lib/store/use-layout-store"
import { Plus, Type, Link as LinkIcon, Share2, Image as ImageIcon, ShoppingBag, Heading, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { SOCIAL_PLATFORMS } from "@/lib/config/social-platforms"
import { EditMediaDialog } from "./edit-media-dialog"

export function AddBlockSheet() {
    const { addTile, tiles } = useLayoutStore()



    const handleAdd = (type: TileType, content: any = {}) => {
        let defaultW = 2
        let defaultH = 2

        if (type === 'hero' || type === 'profile' || type === 'twitter') {
            defaultW = 4
            defaultH = 4
        } else if (type === 'heading') {
            defaultW = 4
            defaultH = 1
        }

        addTile({
            id: crypto.randomUUID(),
            type,
            content,
            x: 0,
            y: 0,
            w: defaultW,
            h: defaultH,
            minW: type === 'heading' ? 4 : (type === 'twitter' ? 2 : 2),
            maxW: type === 'heading' ? 4 : 12,
            minH: type === 'twitter' ? 2 : 1, // Twitter min height 2
            maxH: 6,
            static: type === 'profile',
        })
    }

    // Base blocks
    const baseBlocks = [
        { type: 'heading', label: 'Heading', icon: Heading, content: { text: "Section Title" } },
        { type: 'text', label: 'Text', icon: Type, content: { text: "New Text Block", title: "Note" } },
        { type: 'link', label: 'Link', icon: LinkIcon, content: { url: "#", label: "New Link" } },
        { type: 'media', label: 'Media', icon: ImageIcon, content: { type: "Image", track: "", artist: "", cover: "", title: "", description: "", autoOpen: true } },
        { type: 'profile', label: 'Profile', icon: ImageIcon, content: { name: "Name", role: "Role", bio: "Bio goes here", avatar: "https://github.com/shadcn.png" } },
        { type: 'newsletter', label: 'Get in touch', icon: Mail, content: { title: "Get in touch", description: "Have a project in mind? Let's talk.", buttonText: "Get in touch" } },
        { type: 'map', label: 'Map', icon: Share2, content: { location: "New York, US" } },
    ]

    // Generate blocks for each social platform
    const socialBlocks = Object.values(SOCIAL_PLATFORMS as Record<string, any>).map((platform) => {
        const isTwitter = platform.key === 'Twitter'
        return {
            type: isTwitter ? 'twitter' : 'social', // Use special twitter tile for Twitter
            label: platform.label,
            icon: platform.icon,
            content: isTwitter
                ? { username: "twitter" } // Default for Twitter Tile
                : { platform: platform.key, handle: "", url: "" }, // Default for Social Tile
            platformKey: platform.key
        }
    })

    const allBlocks = [...baseBlocks, ...socialBlocks]

    const [showMediaDialog, setShowMediaDialog] = useState(false)
    const [sheetOpen, setSheetOpen] = useState(false)
    const [isOpeningMedia, setIsOpeningMedia] = useState(false)

    return (
        <>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="default" size="icon" className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-50">
                        <Plus className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    className="overflow-y-auto max-h-screen"
                    onCloseAutoFocus={(e) => {
                        if (isOpeningMedia) {
                            e.preventDefault()
                            setIsOpeningMedia(false)
                        }
                    }}
                >
                    <SheetHeader>
                        <SheetTitle>Add Block</SheetTitle>
                        <SheetDescription>
                            Choose a block type to add to your Bento.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        {allBlocks.map((block: any, index) => {
                            let isDisabled = false
                            let alreadyAdded = false

                            // Check uniqueness
                            if (block.type === 'profile') {
                                if (tiles.some(t => t.type === 'profile')) {
                                    isDisabled = true
                                    alreadyAdded = true
                                }
                            } else if (block.platformKey) {
                                // It's a social block
                                // Check if this platform is already in the grid
                                const isPresent = tiles.some(t => {
                                    if (t.type === 'twitter' && block.platformKey === 'Twitter') return true
                                    if (t.type === 'social' && t.content?.platform === block.platformKey) return true
                                    return false
                                })

                                if (isPresent) {
                                    isDisabled = true
                                    alreadyAdded = true
                                }
                            }

                            // Icon handling (some are components, some might be lucide icons)
                            const Icon = block.icon

                            // Special handling for Media block
                            if (block.type === 'media') {
                                return (
                                    <Button
                                        key={`${block.type}-${index}`}
                                        variant="outline"
                                        className={cn("h-24 flex-col gap-2", isDisabled && "opacity-50 cursor-not-allowed")}
                                        onClick={() => {
                                            if (!isDisabled) {
                                                setIsOpeningMedia(true)
                                                setSheetOpen(false)
                                                setShowMediaDialog(true)
                                            }
                                        }}
                                        disabled={isDisabled}
                                    >
                                        <Icon className="h-6 w-6" />
                                        <span className="text-sm text-center">{block.label}</span>
                                    </Button>
                                )
                            }

                            return (
                                <SheetClose asChild key={`${block.type}-${index}`} disabled={isDisabled}>
                                    <Button
                                        variant="outline"
                                        className={cn("h-24 flex-col gap-2", isDisabled && "opacity-50 cursor-not-allowed")}
                                        onClick={() => !isDisabled && handleAdd(block.type, block.content)}
                                        disabled={isDisabled}
                                    >
                                        <Icon className="h-6 w-6" />
                                        <span className="text-sm text-center">{block.label}</span>
                                        {alreadyAdded && <span className="text-xs text-muted-foreground">(Added)</span>}
                                    </Button>
                                </SheetClose>
                            )
                        })}
                    </div>
                </SheetContent>
            </Sheet>

            <EditMediaDialog
                open={showMediaDialog}
                onOpenChange={setShowMediaDialog}
                onSave={(content) => {
                    handleAdd('media', content)
                    setShowMediaDialog(false)
                }}
            />
        </>
    )
}
