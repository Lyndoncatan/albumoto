import type { Metadata } from "next"
import AlbumGallery from "@/components/album-gallery"

export const metadata: Metadata = {
  title: "Create Album - Albumoto",
  description: "Create and customize your photo album",
}

export default function CreatePage() {
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
        <AlbumGallery />
      </main>
      <footer className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-center text-white">
        <p>© {new Date().getFullYear()} Albumoto. All rights reserved.</p>
      </footer>
    </div>
  )
}

