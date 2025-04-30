"use client"

import { useState } from "react"
import { Play } from "lucide-react"

export default function VideoUpdateSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoId = "jcPxFGm0tl4"
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] animate-pulse-slow"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">HiveFi Weekly Update</h2>
          <p className="text-zinc-300 text-lg mb-12">
            Stay up to date with our latest progress, community growth, and platform development.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-zinc-800 aspect-video">
            {!isPlaying ? (
              <div className="relative cursor-pointer group" onClick={() => setIsPlaying(true)}>
                <img
                  src={thumbnailUrl || "/placeholder.svg"}
                  alt="HiveFi Weekly Update"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-all">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-purple-600 flex items-center justify-center group-hover:bg-purple-500 transition-all">
                    <Play className="h-8 w-8 md:h-10 md:w-10 text-white" fill="white" />
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="HiveFi Weekly Update"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
