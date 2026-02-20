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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLayoutStore, Tile } from "@/lib/store/use-layout-store"
import { SOCIAL_PLATFORMS, DEFAULT_PLATFORM } from "@/lib/config/social-platforms"
import { Check, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditSocialDialogProps {
  tile: Tile
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditSocialDialog({
  tile,
  open,
  onOpenChange,
}: EditSocialDialogProps) {
  const { updateTile } = useLayoutStore()
  const content = tile.content || {}

  const [platformKey, setPlatformKey] = useState(content.platform || "Instagram")
  const [handle, setHandle] = useState(content.handle || "")
  const [customTitle, setCustomTitle] = useState(content.customTitle || "")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")

  const platform = SOCIAL_PLATFORMS[platformKey] || DEFAULT_PLATFORM

  // Clean pasted links
  const cleanInput = (input: string) => {
    let cleaned = input
      .replace(/^@/, "")
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")

    if (cleaned.includes("/")) {
      const parts = cleaned.split("/")
      cleaned = parts.filter(Boolean).pop() || ""
    }

    return cleaned
  }

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setPlatformKey(content.platform || "Instagram")
      setHandle(cleanInput(content.handle || ""))
      setCustomTitle(content.customTitle || "")
      setIsValid(true)
      setError("")
    }
  }, [open])

  // Validate username
  useEffect(() => {
    if (!handle) {
      setIsValid(false)
      setError("")
      return
    }

    const currentPlatform =
      SOCIAL_PLATFORMS[platformKey] || DEFAULT_PLATFORM

    if (currentPlatform.regex.test(handle)) {
      setIsValid(true)
      setError("")
    } else {
      setIsValid(false)
      setError("Invalid username format")
    }
  }, [handle, platformKey])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cleanedHandle = cleanInput(handle)
    const currentPlatform =
      SOCIAL_PLATFORMS[platformKey] || DEFAULT_PLATFORM

    if (!currentPlatform.regex.test(cleanedHandle)) {
      setHandle(cleanedHandle)
      return
    }

    updateTile(tile.id, {
      ...tile,
      content: {
        ...tile.content,
        platform: platformKey,
        handle: cleanedHandle,
        customTitle,
        url: `https://${platform.baseUrl}${cleanedHandle}`,
      },
    })

    onOpenChange(false)
  }

  const fullUrl = `https://${platform.baseUrl}${handle}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Social Link</DialogTitle>
          <DialogDescription>
            Choose a platform and enter your username.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">

            {/* Platform Select */}
            <div className="grid gap-2">
              <Label>Platform</Label>

              <Select value={platformKey} onValueChange={setPlatformKey}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>

                <SelectContent>
                  {Object.values(SOCIAL_PLATFORMS).map((p) => {
                    const isUsed = useLayoutStore
                      .getState()
                      .tiles.some((t) => {
                        if (t.id === tile.id) return false
                        return t.content?.platform === p.key
                      })

                    return (
                      <SelectItem
                        key={p.key}
                        value={p.key}
                        disabled={isUsed}
                      >
                        <div className="flex items-center gap-2 justify-between w-full">
                          <div className="flex items-center gap-2">
                            <p.icon className="h-4 w-4" />
                            {p.label}
                          </div>
                          {isUsed && (
                            <span className="text-xs text-muted-foreground ml-2">
                              (Added)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Username Input */}
            <div className="grid gap-2">
              <Label>Username</Label>

              <div
                className={cn(
                  "flex rounded-md border shadow-sm focus-within:ring-1 focus-within:ring-ring transition-colors",
                  error
                    ? "border-destructive focus-within:ring-destructive"
                    : "border-input"
                )}
              >
                <div className="flex items-center px-3 bg-muted text-muted-foreground text-sm border-r border-input rounded-l-md whitespace-nowrap">
                  {platform.baseUrl}
                </div>

                <div className="flex-1 relative">
                  <input
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    onBlur={() => setHandle(cleanInput(handle))}
                    className="w-full h-full bg-transparent px-3 py-2 text-sm focus:outline-none"
                    placeholder="username"
                    autoComplete="off"
                  />

                  {handle && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isValid ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {isValid ? "Valid username" : error}
              </p>

              {isValid && handle && (
                <p className="text-xs text-muted-foreground truncate">
                  Preview:{" "}
                  <span className="text-primary underline">
                    {fullUrl}
                  </span>
                </p>
              )}
            </div>

            {/* Display Name */}
            <div className="grid gap-2">
              <Label>Display Name (Optional)</Label>
              <Input
                placeholder="Optional"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
              />
            </div>

          </div>

          <DialogFooter>
            <Button type="submit" disabled={!isValid || !handle}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
