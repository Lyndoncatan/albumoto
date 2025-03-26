import type { Metadata } from "next"
import Image from "next/image"
import { Mail, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "About - Albumoto",
  description: "About the developer of Albumoto",
}

export default function AboutPage() {
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
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-6">
            <h2 className="text-2xl font-bold text-white">About the Developer</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 border-4 border-orange-400">
                <Image
                  src="/images/profile.png"
                  alt="Lyndon Domini Catan"
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-orange-700 mb-2">Lyndon Domini Catan</h3>
                <p className="text-gray-600 mb-4">Web Developer</p>

                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-orange-500" />
                    <span>09452807867</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-4 w-4 mr-2 text-orange-500" />
                    <a href="mailto:catanlyndon200316@gmail.com" className="text-orange-600 hover:underline">
                      catanlyndon200316@gmail.com
                    </a>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p>
                    Hello! I'm Lyndon Domini Catan, a passionate web developer and the creator of Albumoto. This project
                    was requested by Lexian Deinty De Vega and is part of my personal portfolio.
                  </p>
                  <p className="mt-4">
                    Albumoto was designed to provide a simple yet powerful way to create and share beautiful photo
                    albums with customizable layouts. I wanted to create something that would allow users to express
                    their creativity while preserving their precious memories.
                  </p>
                  <p className="mt-4">
                    As a web developer, I'm passionate about creating intuitive, user-friendly applications that solve
                    real problems. I specialize in modern web technologies and am constantly learning and improving my
                    skills.
                  </p>
                  <p className="mt-4">
                    Thank you for checking out Albumoto! I hope you enjoy using it as much as I enjoyed building it.
                  </p>
                </div>
                <div className="mt-6 flex gap-4">
                  <a
                    href="#"
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Portfolio
                  </a>
                  <a
                    href="mailto:catanlyndon200316@gmail.com"
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    Contact Me
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-center text-white">
        <p>© {new Date().getFullYear()} Albumoto. All rights reserved.</p>
      </footer>
    </div>
  )
}

