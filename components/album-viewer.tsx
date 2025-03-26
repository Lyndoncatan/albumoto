"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Maximize2 } from "lucide-react"

type MediaItem = {
  id: string
  type: string
  index: number
  dataUrl: string
}

type PublishedAlbum = {
  id: string
  title: string
  category: string
  description: string
  datePublished: string
  layout: string
  columns: number
  gap: number
  bgColor: string
  mediaCount: number
  coverImage: string | null
  media: MediaItem[]
  hidden?: boolean
}

type AlbumViewerProps = {
  album: PublishedAlbum
}

export default function AlbumViewer({ album }: AlbumViewerProps) {
  // Use the media items from the album
  const mediaItems = album.media || []

  if (mediaItems.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-orange-300 rounded-lg">
        <p className="text-orange-700">This album appears to be empty.</p>
      </div>
    )
  }

  const layoutClasses = {
    grid: `grid grid-cols-${album.columns} gap-${album.gap}`,
    masonry: `columns-${album.columns} gap-${album.gap} space-y-${album.gap}`,
    rows: `flex flex-col gap-${album.gap}`,
    columns: `flex flex-row gap-${album.gap} overflow-x-auto`,
    scrapbook: `grid grid-cols-${album.columns} gap-${album.gap}`,
  }

  return (
    <div className={cn("p-4 rounded-lg transition-colors", album.bgColor)}>
      <div
        className={cn(
          layoutClasses[album.layout as keyof typeof layoutClasses],
          album.layout === "rows" ? "items-center" : "",
          album.layout === "columns" ? "items-start" : "",
        )}
      >
        {mediaItems.map((item, index) => (
          <AlbumMediaItem key={item.id} item={item} layout={album.layout} index={index} />
        ))}
      </div>
    </div>
  )
}

type AlbumMediaItemProps = {
  item: MediaItem
  layout: string
  index: number
}

function AlbumMediaItem({ item, layout, index }: AlbumMediaItemProps) {
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

    // Generate a consistent rotation based on the index
    // This ensures the same image always has the same rotation
    const rotationValues = [-8, -5, -2, 2, 5, 8]
    const rotation = rotationValues[index % rotationValues.length]

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
              "absolute top-2 right-2 z-10 bg-black/50 text-white opacity-0 transition-opacity",
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
              src={item.dataUrl || "/placeholder.svg"}
              alt={`Media ${index + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          ) : (
            <video src={item.dataUrl} controls className="w-full h-auto max-h-[80vh]" />
          )}
        </DialogContent>
      </Dialog>

      {item.type === "image" ? (
        <img
          src={item.dataUrl || "/placeholder.svg"}
          alt={`Photo ${index + 1}`}
          className={cn(
            "transition-transform duration-300",
            itemClasses[layout as keyof typeof itemClasses],
            isHovered && layout !== "scrapbook" ? "scale-105" : "scale-100",
          )}
        />
      ) : (
        <video src={item.dataUrl} controls className={cn(itemClasses[layout as keyof typeof itemClasses])} />
      )}

      {layout === "scrapbook" && (
        <div className="absolute bottom-2 left-2 right-2 bg-white/80 p-1 text-xs text-center rounded">
          {`Photo ${index + 1}`}
        </div>
      )}
    </div>
  )
}

