"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2, Eye, EyeOff } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import AlbumViewer from "@/components/album-viewer"

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

export default function AlbumPage({ params }: { params: { id: string } }) {
  const [album, setAlbum] = useState<PublishedAlbum | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // In a real app, we would fetch this from an API
    // For now, we'll use localStorage to simulate persistence
    const savedAlbums = JSON.parse(localStorage.getItem("publishedAlbums") || "[]")
    const foundAlbum = savedAlbums.find((a: PublishedAlbum) => a.id === params.id)

    if (foundAlbum) {
      setAlbum(foundAlbum)
    } else {
      setNotFound(true)
    }

    setLoading(false)
  }, [params.id])

  const handleDelete = () => {
    if (!album) return

    const savedAlbums = JSON.parse(localStorage.getItem("publishedAlbums") || "[]")
    const updatedAlbums = savedAlbums.filter((a: PublishedAlbum) => a.id !== album.id)
    localStorage.setItem("publishedAlbums", JSON.stringify(updatedAlbums))

    router.push("/")
  }

  const toggleHidden = () => {
    if (!album) return

    const savedAlbums = JSON.parse(localStorage.getItem("publishedAlbums") || "[]")
    const updatedAlbums = savedAlbums.map((a: PublishedAlbum) => {
      if (a.id === album.id) {
        return { ...a, hidden: !album.hidden }
      }
      return a
    })

    localStorage.setItem("publishedAlbums", JSON.stringify(updatedAlbums))
    setAlbum({ ...album, hidden: !album.hidden })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
        <header className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 shadow-md">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Albumoto</h1>
                <p className="text-amber-100">Your beautiful photo album</p>
              </div>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <a href="/" className="text-white hover:text-amber-200 font-medium">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/create" className="text-white hover:text-amber-200 font-medium">
                      Create Album
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="text-white hover:text-amber-200 font-medium">
                      About
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-orange-500">Loading album...</div>
          </div>
        </main>
        <footer className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-center text-white">
          <p>© {new Date().getFullYear()} Albumoto. All rights reserved.</p>
        </footer>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
        <header className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 shadow-md">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Albumoto</h1>
                <p className="text-amber-100">Your beautiful photo album</p>
              </div>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <a href="/" className="text-white hover:text-amber-200 font-medium">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/create" className="text-white hover:text-amber-200 font-medium">
                      Create Album
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="text-white hover:text-amber-200 font-medium">
                      About
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto py-8 px-4">
          <div className="text-center py-12 border-2 border-dashed border-orange-300 rounded-lg">
            <p className="text-orange-700 text-xl">Album not found</p>
            <p className="text-orange-500 mt-2">The album you're looking for doesn't exist or has been deleted.</p>
            <Button onClick={() => router.push("/")} className="mt-4 bg-orange-500 hover:bg-orange-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </main>
        <footer className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-center text-white">
          <p>© {new Date().getFullYear()} Albumoto. All rights reserved.</p>
        </footer>
      </div>
    )
  }

  if (!album) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <header className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Albumoto</h1>
              <p className="text-amber-100">Your beautiful photo album</p>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a href="/" className="text-white hover:text-amber-200 font-medium">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/create" className="text-white hover:text-amber-200 font-medium">
                    Create Album
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-white hover:text-amber-200 font-medium">
                    About
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h2 className="text-2xl font-bold text-orange-700">{album.title}</h2>
              {album.hidden && (
                <Badge variant="outline" className="bg-gray-100 text-gray-500">
                  Hidden
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleHidden}>
                {album.hidden ? (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Unhide
                  </>
                ) : (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide
                  </>
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the album "{album.title}". This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
              <div>
                <h3 className="font-medium text-gray-500">Description</h3>
                <p className="mt-1">{album.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-500">Category</h3>
                  <p className="mt-1 capitalize">{album.category}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Published</h3>
                  <p className="mt-1">{format(new Date(album.datePublished), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Layout</h3>
                  <p className="mt-1 capitalize">{album.layout}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Media Count</h3>
                  <p className="mt-1">{album.mediaCount} items</p>
                </div>
              </div>
            </div>
          </div>

          <AlbumViewer album={album} />
        </div>
      </main>
      <footer className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-center text-white">
        <p>© {new Date().getFullYear()} Albumoto. All rights reserved.</p>
      </footer>
    </div>
  )
}

