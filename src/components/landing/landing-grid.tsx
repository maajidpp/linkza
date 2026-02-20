"use client"

import React, { useState } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable"
import { SortableTile } from "@/components/grid/sortable-tile"
import { Tile } from "@/lib/store/use-layout-store"

// Mock data for landing page demo
// Mock data for landing page demo
// Mock data for landing page demo
const DEMO_TILES: Tile[] = [
    {
        id: "profile",
        type: "profile",
        content: {
            name: "John Doe",
            role: "Product Designer",
            bio: "Building digital gardens & styling the web.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
            location: "Kyoto, Japan",
            available: true
        },
        x: 0,
        y: 0,
        w: 4,
        h: 4,
    },
    {
        id: "hero-media",
        type: "media",
        content: {
            type: "Image",
            cover: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop",
            title: "Neon Nights",
            artist: "Cyberpunk Collection"
        },
        x: 4,
        y: 0,
        w: 4,
        h: 2,
    },
    {
        id: "map",
        type: "map",
        content: {
            latitude: 35.6762,
            longitude: 139.6503,
            label: "Tokyo, Japan",
            theme: "dark"
        },
        x: 4,
        y: 2,
        w: 2,
        h: 2,
    },
    {
        id: "twitter",
        type: "twitter",
        content: {
            username: "johndoe",
            followerCount: "28.5K",
            customTitle: "Thoughts",
        },
        x: 6,
        y: 2,
        w: 1,
        h: 2,
    },
    {
        id: "instagram",
        type: "social",
        content: {
            platform: "Instagram",
            handle: "john.visuals",
            followerCount: "142K",
            customTitle: "Gallery"
        },
        x: 7,
        y: 2,
        w: 1,
        h: 2,
    },
    {
        id: "link-portfolio",
        type: "link",
        content: {
            url: "https://dribbble.com",
            title: "Latest Case Study",
            description: "Redesigning the future of finance apps.",
            coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop"
        },
        x: 0,
        y: 4,
        w: 2,
        h: 2,
    },
    {
        id: "newsletter",
        type: "newsletter",
        content: {
            title: "Design Digest",
            description: "Weekly insights on UI/UX & React.",
            buttonText: "Subscribe",
            placeholder: "email@example.com"
        },
        x: 2,
        y: 4,
        w: 2,
        h: 2,
    },
    {
        id: "text-quote",
        type: "text",
        content: {
            text: "“Design is not just what it looks like and feels like. Design is how it works.”",
            title: "Philosophy"
        },
        x: 4,
        y: 4,
        w: 2,
        h: 2,
    },
    {
        id: "spotify",
        type: "link",
        content: {
            url: "https://spotify.com",
            title: "Focus Mix",
            description: "Deep work playlist.",
            coverImage: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?q=80&w=2670&auto=format&fit=crop"
        },
        x: 6,
        y: 4,
        w: 2,
        h: 1,
    },
    {
        id: "github",
        type: "social",
        content: {
            platform: "Github",
            handle: "johndoe",
            followerCount: "4.2K",
            customTitle: "Code"
        },
        x: 6,
        y: 5,
        w: 1,
        h: 1,
    },
    {
        id: "linkedin",
        type: "social",
        content: {
            platform: "Linkedin",
            handle: "johndoe",
            followerCount: "8K",
            customTitle: "Connect"
        },
        x: 7,
        y: 5,
        w: 1,
        h: 1,
    }
]

export function LandingGrid() {
    const [tiles, setTiles] = useState<Tile[]>(DEMO_TILES)
    const [activeId, setActiveId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragStart(event: any) {
        setActiveId(event.active.id)
    }

    function handleDragEnd(event: any) {
        const { active, over } = event

        if (active.id !== over?.id) {
            setTiles((items) => {
                const oldIndex = items.findIndex((t) => t.id === active.id)
                const newIndex = items.findIndex((t) => t.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
        setActiveId(null)
    }

    const activeTile = activeId ? tiles.find((t) => t.id === activeId) : null

    return (
        <div className="w-full max-w-4xl mx-auto p-4 perspective-1000">
            <DndContext
                id="landing-grid-dnd-context"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="transform transition-transform hover:scale-[1.01] duration-500">
                    <SortableContext items={tiles} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-2 md:grid-cols-8 gap-4 auto-rows-[100px]">
                            {tiles.map((tile) => (
                                <SortableTile key={tile.id} tile={tile} disableEditing={true} isDemo={true} />
                            ))}
                        </div>
                    </SortableContext>
                </div>
                <DragOverlay>
                    {activeTile ? (
                        <div className="opacity-80">
                            <SortableTile tile={activeTile} disableEditing={true} isDemo={true} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}
