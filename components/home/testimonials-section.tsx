"use client"

import { useDataFetch } from "@/hooks/use-data-fetch"
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card"
import { Skeleton } from "@/components/ui/skeleton"
import portfolioData from "@/services/index"
import type { Testimonial } from "@/types/home"
import Image from "next/image"

export default function TestimonialsSection() {
  const { data: testimonials, isLoading, error } = useDataFetch<Testimonial[]>(portfolioData.getTestimonials)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-8 rounded-xl relative animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton width={64} height={64} className="rounded-full" />
              <div>
                <Skeleton width={96} height={20} className="mb-2" />
                <Skeleton width={128} height={16} />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton width="100%" height={16} />
              <Skeleton width="100%" height={16} />
              <Skeleton width="75%" height={16} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error || !testimonials) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error?.message || "Failed to load testimonials"}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial) => (
        <GlassCard key={testimonial.name} gradientBorder>
          <GlassCardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500 glow">
                <Image
                  src={testimonial.image || "/placeholder.svg?height=80&width=80"}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg">{testimonial.name}</h4>
                <p className="text-zinc-400">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-zinc-300 italic">&quot;{testimonial.quote}&quot;</p>
          </GlassCardContent>
        </GlassCard>
      ))}
    </div>
  )
}
