"use client"

import React, { useState, useEffect } from "react"
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
import { useLayoutStore, Tile } from "@/lib/store/use-layout-store"
import { SortableTile } from "./sortable-tile"
import { cn } from "@/lib/utils"

export function BentoGrid({ disableAutoFetch = false }: { disableAutoFetch?: boolean }) {
    const { tiles, updateLayout, fetchLayout } = useLayoutStore()
    const [mounted, setMounted] = useState(false)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [activeSize, setActiveSize] = useState<{ width: number; height: number } | null>(null)

    useEffect(() => {
        setMounted(true)
        if (!disableAutoFetch) {
            fetchLayout()
        }
    }, [fetchLayout, disableAutoFetch])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragStart(event: any) {
        const { active } = event
        setActiveId(active.id)

        // Get the dragged element's dimensions
        const element = document.getElementById(active.id)
        if (element) {
            const rect = element.getBoundingClientRect()
            setActiveSize({
                width: rect.width,
                height: rect.height,
            })
        }
    }

    function handleDragEnd(event: any) {
        const { active, over } = event

        if (active.id !== over?.id) {
            const currentTiles = useLayoutStore.getState().tiles
            const profile = currentTiles.find(t => t.type === 'profile')
            let others = currentTiles.filter(t => t.type !== 'profile')

            const oldIndexInOthers = others.findIndex((t) => t.id === active.id)
            const newIndexInOthers = others.findIndex((t) => t.id === over.id)

            if (oldIndexInOthers !== -1 && newIndexInOthers !== -1) {
                others = arrayMove(others, oldIndexInOthers, newIndexInOthers)
                const newTiles = profile ? [profile, ...others] : others
                updateLayout(newTiles)
            }
        }

        setActiveId(null)
        setActiveSize(null)
    }

    if (!mounted) return null

    const activeTile = activeId ? tiles.find((t) => t.id === activeId) : null
    const { isEditMode } = useLayoutStore.getState()

    return (
        <DndContext
            id="bento-grid-dnd-context"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col lg:flex-row gap-24 p-8 max-w-[1600px] mx-auto">
                {/* Left Column - Profile (Sticky on Desktop) */}
                <aside className="w-full lg:w-[350px] xl:w-[400px] flex-shrink-0 lg:sticky lg:top-8 lg:h-fit z-10">
                    {tiles.filter(t => t.type === 'profile').map(tile => (
                        <div
                            key={tile.id}
                            className="w-full h-full"
                        >
                            <SortableTile tile={tile} isStatic />
                        </div>
                    ))}
                </aside>

                {/* Right Column - Scrollable Grid */}
                <main className="flex-1 min-w-0">
                    <SortableContext items={tiles.filter(t => t.type !== 'profile')} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(100px,auto)]">
                            {tiles.filter(t => t.type !== 'profile').map((tile) => (
                                <SortableTile key={tile.id} id={tile.id} tile={tile} />
                            ))}
                        </div>
                    </SortableContext>
                </main>
            </div>

            <DragOverlay>
                {activeTile && activeSize ? (
                    <div
                        style={{
                            width: activeSize.width,
                            height: activeSize.height,
                        }}
                        className="opacity-90"
                    >
                        <SortableTile
                            tile={activeTile}
                            isOverlay
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
