"use client"

import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useLayoutStore, Tile } from "@/lib/store/use-layout-store"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ProfileTile } from "@/components/tiles/profile-tile"
import { SocialTile } from "@/components/tiles/social-tile"
import { TextTile } from "@/components/tiles/text-tile"
import { MediaTile } from "@/components/tiles/media-tile"
import { LinkTile } from "@/components/tiles/link-tile"
import { HeadingTile } from "@/components/tiles/heading-tile"
import { TwitterTile } from "@/components/tiles/twitter-tile"
import { NewsletterTile } from "@/components/tiles/newsletter-tile"
import { MapTile } from "@/components/tiles/map-tile"
import { EditMapDialog } from "@/components/modules/edit-map-dialog"
import { X, Lock, Pencil } from "lucide-react"

interface SortableTileProps {
    tile: Tile
    isStatic?: boolean
    id?: string
    isOverlay?: boolean
    style?: React.CSSProperties
    disableEditing?: boolean
    isDemo?: boolean
}

const COMPONENTS: Record<string, any> = {
    profile: ProfileTile,
    social: SocialTile,
    text: TextTile,
    media: MediaTile,
    link: LinkTile,
    heading: HeadingTile,
    twitter: TwitterTile,
    newsletter: NewsletterTile,
    map: MapTile,
}

export function SortableTile({ tile, isStatic = false, id, isOverlay = false, style: propStyle, disableEditing = false, isDemo = false }: SortableTileProps) {
    const [showMapDialog, setShowMapDialog] = React.useState(false)

    // Store state
    const { isEditMode: storeEditMode, removeTile, updateTile } = useLayoutStore()

    // Override isEditMode if disabled
    const isEditMode = disableEditing ? false : storeEditMode

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: id || tile.id,
        disabled: isStatic || isOverlay || !isEditMode
    })

    const Component = COMPONENTS[tile.type] || TextTile

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...propStyle,
    }

    if (isStatic) {
        return (
            <div
                className={cn(
                    "group relative h-full",
                )}
            >
                <Card className={cn(
                    "h-full w-full overflow-hidden transition-all duration-300 p-0",
                    "rounded-2xl border-none shadow-sm hover:shadow-md",
                    tile.type === 'profile'
                        ? "bg-transparent shadow-none"
                        : "bg-background/60 backdrop-blur-xl border border-border/10"
                )}>
                    <CardContent className="p-0 h-full relative">
                        {isDemo && <div className="absolute inset-0 z-50 bg-transparent" />}
                        <Component content={tile.content} tile={tile} />
                    </CardContent>
                </Card>
                {isEditMode && (
                    <div className="absolute top-2 left-2 z-[60] hidden lg:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-zinc-800/80 text-white rounded-full p-1.5 shadow-sm" title="Pinned">
                            <Lock className="h-3 w-3" />
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // Logic for determining column span based on width
    // w=1 -> 3 cols (1/4 desktop), 2 cols (1/3 tablet)
    // w=2 -> 6 cols (1/2 desktop), 3 cols (1/2 tablet)
    // w=3 -> 9 cols (3/4 desktop), 4 cols (2/3 tablet)
    // w=4 -> 12 cols (Full desktop), 6 cols (Full tablet)
    const responsiveClass = !isOverlay
        ? (tile.w >= 4 ? "lg:col-span-12 md:col-span-6 col-span-2" :
            tile.w === 3 ? "lg:col-span-9 md:col-span-4 col-span-2" :
                tile.w === 2 ? "lg:col-span-6 md:col-span-3 col-span-2" :
                    "lg:col-span-3 md:col-span-2 col-span-1") // w=1
        : ""

    const responsiveRowClass = !isOverlay ? (tile.h >= 2 ? "row-span-2" : "row-span-1") : ""

    return (
        <div
            ref={setNodeRef}
            id={id || tile.id}
            style={style}
            className={cn(
                "group relative h-full",
                responsiveClass,
                responsiveRowClass,
                isDragging && "z-50 opacity-50",
                isOverlay && "cursor-grabbing z-50",
            )}
            {...attributes}
            {...listeners}
        >
            <Card className={cn(
                "h-full w-full overflow-hidden p-0 cursor-grab active:cursor-grabbing",
                "transition-all duration-300 ease-in-out",
                "rounded-2xl hover:-translate-y-1 hover:shadow-lg border-border/40",
                (tile.type === 'heading' || tile.type === 'profile')
                    ? "bg-transparent border-none shadow-none hover:shadow-none hover:translate-y-0"
                    : "bg-background/80 backdrop-blur-xl border shadow-sm"
            )}>
                <CardContent className="p-0 h-full relative">
                    {/* Demo Overlay to block clicks but allow drag */}
                    {isDemo && <div className="absolute inset-0 z-50 bg-transparent" />}
                    <Component content={tile.content} tile={tile} />
                </CardContent>
            </Card>

            {isEditMode && !isDragging && (
                <>
                    {/* Edit Button for Map */}
                    {tile.type === 'map' && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowMapDialog(true)
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="absolute top-2 right-2 z-[60] bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                            <EditMapDialog tile={tile} open={showMapDialog} onOpenChange={setShowMapDialog} />
                        </>
                    )}

                    {/* Delete Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            removeTile(tile.id)
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute -top-3 -right-3 z-[60] bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90 scale-75 hover:scale-100"
                        title="Remove tile"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* Resize Toolbar - Hide for Headings */}
                    {tile.type !== 'heading' && (
                        <>
                            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-[60] bg-zinc-600/90 backdrop-blur-md text-white rounded-full p-1.5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl scale-90 hover:scale-100 origin-top">
                                <button
                                    className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
                                    onClick={(e) => { e.stopPropagation(); updateTile(tile.id, { w: 1, h: 1 }) }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    title="Small (1x1)"
                                >
                                    <div className="w-3 h-3 border-2 border-white/80 rounded-[1px]" />
                                </button>
                                <button
                                    className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
                                    onClick={(e) => { e.stopPropagation(); updateTile(tile.id, { w: 2, h: 1 }) }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    title="Medium (2x1)"
                                >
                                    <div className="w-6 h-3 border-2 border-white/80 rounded-[2px]" />
                                </button>
                                <button
                                    className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
                                    onClick={(e) => { e.stopPropagation(); updateTile(tile.id, { w: 2, h: 2 }) }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    title="Large (2x2)"
                                >
                                    <div className="w-6 h-6 border-2 border-white/80 rounded-[2px]" />
                                </button>
                            </div>

                            {/* Resize Handle */}
                            <div
                                className="absolute bottom-1 right-1 w-4 h-4 cursor-nwse-resize opacity-0 group-hover:opacity-100 z-[60]"
                                onPointerDown={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()

                                    const startX = e.clientX
                                    const startY = e.clientY
                                    const startW = tile.w
                                    const startH = tile.h

                                    // Estimate grid cell size (approximate for drag feeling)
                                    const CELL_SIZE = 100

                                    const onPointerMove = (moveEvent: PointerEvent) => {
                                        const deltaX = moveEvent.clientX - startX
                                        const deltaY = moveEvent.clientY - startY

                                        const spanX = Math.round(deltaX / CELL_SIZE)
                                        const spanY = Math.round(deltaY / CELL_SIZE)

                                        // Enforce min width 1 (Small)
                                        const newW = Math.max(1, Math.min(4, startW + spanX))
                                        const newH = Math.max(1, Math.min(4, startH + spanY))

                                        if (newW !== tile.w || newH !== tile.h) {
                                            updateTile(tile.id, { w: newW, h: newH })
                                        }
                                    }

                                    const onPointerUp = () => {
                                        window.removeEventListener('pointermove', onPointerMove)
                                        window.removeEventListener('pointerup', onPointerUp)
                                    }

                                    window.addEventListener('pointermove', onPointerMove)
                                    window.addEventListener('pointerup', onPointerUp)
                                }}
                            >
                                <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-current rounded-br cursor-nwse-resize" />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}
