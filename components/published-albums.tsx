"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Book, Calendar, Grid3X3, Rows, Columns, EyeOff } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
  media: any[]
  hidden?: boolean
}

export default function PublishedAlbums() {
  const [albums, setAlbums] = useState<PublishedAlbum[]>([])
  const [showHidden, setShowHidden] = useState(false)

  useEffect(() => {
    // In a real app, we would fetch this from an API
    // For now, we'll use localStorage to simulate persistence
    const savedAlbums = JSON.parse(localStorage.getItem("publishedAlbums") || "[]")
    setAlbums(savedAlbums)
  }, [])

  const visibleAlbums = showHidden ? albums : albums.filter((album) => !album.hidden)

  if (albums.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-orange-300 rounded-lg">
        <p className="text-orange-700">
          No albums published yet. Go to the Create Album page to make your first album!
        </p>
        <a
          href="/create"
          className="inline-block mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Create Album
        </a>
      </div>
    )
  }

  if (visibleAlbums.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-end mb-4 space-x-2">
          <Switch id="show-hidden" checked={showHidden} onCheckedChange={setShowHidden} />
          <Label htmlFor="show-hidden">Show hidden albums</Label>
        </div>

        <div className="text-center py-12 border-2 border-dashed border-orange-300 rounded-lg">
          <p className="text-orange-700">No visible albums. Toggle the switch above to show hidden albums.</p>
        </div>
      </div>
    )
  }

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case "grid":
        return <Grid3X3 className="h-4 w-4" />
      case "rows":
        return <Rows className="h-4 w-4" />
      case "columns":
        return <Columns className="h-4 w-4" />
      case "scrapbook":
        return <Book className="h-4 w-4" />
      default:
        return <Grid3X3 className="h-4 w-4" />
    }
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-4 space-x-2">
        <Switch id="show-hidden" checked={showHidden} onCheckedChange={setShowHidden} />
        <Label htmlFor="show-hidden">Show hidden albums</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleAlbums.map((album) => (
          <Link href={`/album/${album.id}`} key={album.id} className="block">
            <Card
              className={cn(
                "overflow-hidden hover:shadow-lg transition-shadow h-full",
                album.hidden ? "opacity-75" : "",
              )}
            >
              <div className="aspect-video relative overflow-hidden bg-orange-100">
                {album.media && album.media.length > 0 ? (
                  <img
                    src={album.media[0].dataUrl || "/placeholder.svg"}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange-300">
                    <Book className="h-16 w-16" />
                  </div>
                )}
                <Badge className="absolute top-2 right-2 bg-orange-500">{album.category}</Badge>
                {album.hidden && (
                  <div className="absolute top-2 left-2 bg-gray-800/70 text-white px-2 py-1 rounded-md text-xs flex items-center">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Hidden
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-orange-700">{album.title}</h3>
                  <div className="flex items-center text-orange-500 text-sm">{getLayoutIcon(album.layout)}</div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-600 line-clamp-2">{album.description || "No description provided."}</p>
              </CardContent>
              <CardFooter className="text-xs text-gray-500 flex justify-between">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(album.datePublished), { addSuffix: true })}
                </div>
                <div>{album.mediaCount} items</div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

