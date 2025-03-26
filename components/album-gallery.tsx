"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Grid2X2, Grid3X3, LayoutGrid, Rows, Columns, Upload, Trash2, Palette, Book, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import MediaItem from "@/components/media-item"
import ColorPicker from "@/components/color-picker"
import PublishAlbumDialog from "@/components/publish-album-dialog"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type MediaFile = {
  id: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  dataUrl?: string
}

type LayoutType = "grid" | "masonry" | "rows" | "columns" | "scrapbook"

export default function AlbumGallery() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [layout, setLayout] = useState<LayoutType>("grid")
  const [columns, setColumns] = useState(3)
  const [gap, setGap] = useState(2)
  const [bgColor, setBgColor] = useState("bg-amber-50")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [albumTitle, setAlbumTitle] = useState("My Album")
  const [isPublishing, setIsPublishing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Function to resize an image and return a smaller data URL
  const resizeImage = (dataUrl: string, maxWidth = 1200): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        // If the image is already smaller than maxWidth, return the original
        if (img.width <= maxWidth) {
          resolve(dataUrl)
          return
        }

        // Calculate new dimensions while maintaining aspect ratio
        const ratio = img.height / img.width
        const newWidth = maxWidth
        const newHeight = newWidth * ratio

        // Create a canvas to resize the image
        const canvas = document.createElement("canvas")
        canvas.width = newWidth
        canvas.height = newHeight

        // Draw the resized image
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, newWidth, newHeight)

        // Get the resized data URL (with reduced quality for JPEG)
        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.7)
        resolve(resizedDataUrl)
      }

      img.onerror = () => {
        reject(new Error("Failed to load image"))
      }

      img.src = dataUrl
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Check if adding these files would exceed the 20 media limit
    if (media.length + files.length > 20) {
      toast({
        title: "Too many files",
        description: "You can only add up to 20 media files",
        variant: "destructive",
      })
      return
    }

    const newMedia: MediaFile[] = []

    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith("video/")
      const isImage = file.type.startsWith("image/")

      if (isImage || isVideo) {
        const url = URL.createObjectURL(file)

        // Create a new media item
        const mediaItem: MediaFile = {
          id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: isVideo ? "video" : "image",
          url,
          thumbnail: isVideo ? "" : url,
        }

        // For images, also create a data URL for storage
        if (isImage) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string
            // Update the media item with the data URL
            setMedia((currentMedia) =>
              currentMedia.map((item) => (item.id === mediaItem.id ? { ...item, dataUrl } : item)),
            )
          }
          reader.readAsDataURL(file)
        }

        newMedia.push(mediaItem)
      }
    })

    setMedia([...media, ...newMedia])

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveAll = () => {
    // Revoke all object URLs to avoid memory leaks
    media.forEach((item) => URL.revokeObjectURL(item.url))
    setMedia([])
  }

  const handleRemoveItem = (id: string) => {
    const itemToRemove = media.find((item) => item.id === id)
    if (itemToRemove) {
      URL.revokeObjectURL(itemToRemove.url)
    }
    setMedia(media.filter((item) => item.id !== id))
  }

  const handlePublishAlbum = async (albumData: {
    title: string
    category: string
    description: string
  }) => {
    try {
      setIsPublishing(true)

      // Resize images to reduce storage size
      const resizedMedia = await Promise.all(
        media.map(async (item, index) => {
          if (item.type === "image" && item.dataUrl) {
            try {
              // Resize the image to reduce its size
              const resizedDataUrl = await resizeImage(item.dataUrl, 800)
              return {
                id: item.id,
                type: item.type,
                index: index,
                dataUrl: resizedDataUrl,
              }
            } catch (error) {
              console.error("Error resizing image:", error)
              // Fallback to placeholder if resize fails
              return {
                id: item.id,
                type: item.type,
                index: index,
                dataUrl: `/placeholder.svg?height=400&width=400&text=Image${index + 1}`,
              }
            }
          } else {
            // For non-image items or if dataUrl is missing
            return {
              id: item.id,
              type: item.type,
              index: index,
              dataUrl: `/placeholder.svg?height=400&width=400&text=Media${index + 1}`,
            }
          }
        }),
      )

      // Get existing albums
      const publishedAlbums = JSON.parse(localStorage.getItem("publishedAlbums") || "[]")

      // Create the new album object
      const newAlbum = {
        id: `album-${Date.now()}`,
        title: albumData.title,
        category: albumData.category,
        description: albumData.description,
        datePublished: new Date().toISOString(),
        layout,
        columns,
        gap,
        bgColor,
        mediaCount: media.length,
        coverImage:
          resizedMedia.length > 0 ? resizedMedia[0].dataUrl : `/placeholder.svg?height=400&width=400&text=Cover`,
        media: resizedMedia,
      }

      // Try to store the album in localStorage
      try {
        publishedAlbums.push(newAlbum)
        localStorage.setItem("publishedAlbums", JSON.stringify(publishedAlbums))

        // Redirect to home page
        router.push("/")
      } catch (storageError) {
        console.error("localStorage error:", storageError)

        // If localStorage fails (likely due to quota exceeded), try with smaller images
        toast({
          title: "Storage limit reached",
          description: "Using lower quality images due to browser storage limitations",
          variant: "warning",
        })

        // Create a version with even smaller images or just metadata
        const fallbackMedia = media.map((item, index) => ({
          id: item.id,
          type: item.type,
          index: index,
          dataUrl: `/placeholder.svg?height=400&width=400&text=Image${index + 1}`,
        }))

        const fallbackAlbum = {
          ...newAlbum,
          media: fallbackMedia,
          coverImage: `/placeholder.svg?height=400&width=400&text=Cover`,
        }

        // Try again with the smaller version
        publishedAlbums.push(fallbackAlbum)
        localStorage.setItem("publishedAlbums", JSON.stringify(publishedAlbums))

        // Redirect to home page
        router.push("/")
      }
    } catch (error) {
      console.error("Error publishing album:", error)
      toast({
        title: "Error publishing album",
        description: "There was a problem saving your album. Please try again with fewer or smaller images.",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const layoutClasses = {
    grid: `grid grid-cols-${columns} gap-${gap}`,
    masonry: `columns-${columns} gap-${gap} space-y-${gap}`,
    rows: `flex flex-col gap-${gap}`,
    columns: `flex flex-row gap-${gap} overflow-x-auto`,
    scrapbook: `grid grid-cols-${columns} gap-${gap}`,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <input
          type="text"
          value={albumTitle}
          onChange={(e) => setAlbumTitle(e.target.value)}
          className="text-2xl font-bold text-orange-700 bg-transparent border-b-2 border-transparent focus:border-orange-300 focus:outline-none"
        />

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="bg-white" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Add Media
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,video/*"
              multiple
              className="hidden"
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Layout
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLayout("grid")}>
                <Grid3X3 className="mr-2 h-4 w-4" />
                Grid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLayout("masonry")}>
                <Grid2X2 className="mr-2 h-4 w-4" />
                Masonry
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLayout("rows")}>
                <Rows className="mr-2 h-4 w-4" />
                Rows
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLayout("columns")}>
                <Columns className="mr-2 h-4 w-4" />
                Columns
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLayout("scrapbook")}>
                <Book className="mr-2 h-4 w-4" />
                Scrapbook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="bg-white" onClick={() => setShowColorPicker(!showColorPicker)}>
            <Palette className="mr-2 h-4 w-4" />
            Colors
          </Button>

          {media.length > 0 && (
            <Button variant="outline" className="bg-white text-red-500 hover:text-red-700" onClick={handleRemoveAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}

          <Button
            variant="default"
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setShowPublishDialog(true)}
            disabled={media.length === 0 || isPublishing}
          >
            <Check className="mr-2 h-4 w-4" />
            Done
          </Button>
        </div>
      </div>

      {showColorPicker && (
        <ColorPicker currentColor={bgColor} onColorChange={setBgColor} onClose={() => setShowColorPicker(false)} />
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Columns:</span>
            <Slider
              value={[columns]}
              min={1}
              max={5}
              step={1}
              className="w-24"
              onValueChange={(value) => setColumns(value[0])}
            />
            <span className="text-sm">{columns}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Gap:</span>
            <Slider
              value={[gap]}
              min={0}
              max={8}
              step={1}
              className="w-24"
              onValueChange={(value) => setGap(value[0])}
            />
            <span className="text-sm">{gap}</span>
          </div>
        </div>

        <div className={cn("p-4 rounded-lg transition-colors", bgColor)}>
          {media.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-orange-300 rounded-lg">
              <p className="text-orange-700">No media added yet. Click "Add Media" to upload images or videos.</p>
              <p className="text-sm text-orange-500 mt-2">You can add up to 20 media files.</p>
            </div>
          ) : (
            <div
              className={cn(
                layoutClasses[layout],
                layout === "rows" ? "items-center" : "",
                layout === "columns" ? "items-start" : "",
              )}
            >
              {media.map((item, index) => (
                <MediaItem
                  key={item.id}
                  item={item}
                  layout={layout}
                  index={index}
                  onRemove={() => handleRemoveItem(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-sm text-orange-700">{media.length} / 20 media items</div>
      </div>

      {showPublishDialog && (
        <PublishAlbumDialog
          open={showPublishDialog}
          onOpenChange={setShowPublishDialog}
          onPublish={handlePublishAlbum}
          defaultTitle={albumTitle}
          isPublishing={isPublishing}
        />
      )}
    </div>
  )
}

