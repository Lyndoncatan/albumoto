"use client"

import { useState } from "react"
import { Trash2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type MediaFile = {
  id: string
  type: "image" | "video"
  url: string
  thumbnail?: string
}

type MediaItemProps = {
  item: MediaFile
  layout: string
  index: number
  onRemove: () => void
}

export default function MediaItem({ item, layout, index, onRemove }: MediaItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const itemClasses = {
    grid: "aspect-square object-cover w-full h-full",
    masonry: "w-full mb-4",
    rows: "w-full max-w-3xl",
    columns: "h-64 flex-shrink-0",
    scrapbook: "w-full h-full object-cover",
  }

  // For scrapbook layout, add random rotation and border styles
  const getScrapbookStyles = () => {
    if (layout !== "scrapbook") return {}

    // Generate a random rotation between -10 and 10 degrees
    const rotation = Math.floor(Math.random() * 20) - 10

    // Alternate between different border styles
    const borderStyles = [
      "border-4 border-white shadow-lg",
      "border-4 border-yellow-100 shadow-lg",
      "border-4 border-orange-100 shadow-lg",
      "border-8 border-white shadow-lg",
    ]

    const borderStyle = borderStyles[index % borderStyles.length]

    return {
      transform: `rotate(${rotation}deg)`,
      className: `${borderStyle} p-1 bg-white z-10 hover:z-20 transition-all duration-300`,
    }
  }

  const scrapbookStyles = getScrapbookStyles()

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden group",
        layout === "columns" ? "h-64" : "",
        layout === "scrapbook" ? scrapbookStyles.className : "",
      )}
      style={layout === "scrapbook" ? { transform: scrapbookStyles.transform } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-12 z-10 bg-black/50 text-white opacity-0 transition-opacity",
              isHovered ? "opacity-100" : "opacity-0",
              "hover:bg-black/70",
            )}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          {item.type === "image" ? (
            <img
              src={item.url || "/placeholder.svg"}
              alt="Media preview"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          ) : (
            <video src={item.url} controls className="w-full h-auto max-h-[80vh]" />
          )}
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-2 right-2 z-10 bg-black/50 text-white opacity-0 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0",
          "hover:bg-black/70",
        )}
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {item.type === "image" ? (
        <img
          src={item.url || "/placeholder.svg"}
          alt="Album media"
          className={cn(
            "transition-transform duration-300",
            itemClasses[layout as keyof typeof itemClasses],
            isHovered && layout !== "scrapbook" ? "scale-105" : "scale-100",
          )}
        />
      ) : (
        <video src={item.url} controls className={cn(itemClasses[layout as keyof typeof itemClasses])} />
      )}

      {layout === "scrapbook" && (
        <div className="absolute bottom-2 left-2 right-2 bg-white/80 p-1 text-xs text-center rounded">
          {`Photo ${index + 1}`}
        </div>
      )}
    </div>
  )
}

