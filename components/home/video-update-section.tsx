'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

export default function VideoUpdateSection() {
  const [videoIds, setVideoIds] = useState(['5gcIcfQ4owI', 'qcwOXQzlzD0', 'jcPxFGm0tl4'])

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] animate-pulse-slow"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
            HiveFi Weekly Update
          </h2>
          <p className="text-zinc-300 text-lg mb-12">
            Stay up to date with our latest progress, community growth, and
            platform development.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col justify-center space-y-4 mb-4">
            {videoIds.map((id, index) => (
              <div
                key={id}
                className="relative rounded-xl overflow-hidden shadow-2xl border border-zinc-800 aspect-video mb-4"
              >
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${id}`}
                  title={`HiveFi Weekly Update Week ${index + 2}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
