"use client"

import { useLayoutStore } from "@/lib/store/use-layout-store"
import { AddBlockSheet } from "@/components/modules/add-block-sheet"

export function EditWrapperComponent() {
    const { isEditMode } = useLayoutStore()
    return isEditMode ? <AddBlockSheet /> : null
}
