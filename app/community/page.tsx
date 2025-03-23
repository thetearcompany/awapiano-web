import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AudioPlayerContainer } from "@/containers/audio-player"
import { CommunityContainer } from "@/containers/community"
import { Suspense } from "react"

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative h-[30vh] min-h-[200px] md:h-[40vh] md:min-h-[300px] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black z-0"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-50 z-[-1]"></div>

          <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <div className="max-w-full md:max-w-2xl">
              <div className="flex items-center gap-2 mb-4 animate-fade-in">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Community</h1>
              </div>
              <p className="text-base md:text-xl mb-6 md:mb-8 text-white/80 animate-slide-in">
                Connect with fellow Amapiano enthusiasts, share your thoughts, and stay updated with the latest
                discussions.
              </p>
            </div>
          </div>
        </section>

        {/* Community Feed */}
        <section className="py-8 md:py-12 bg-black">
          <div className="container max-w-4xl mx-auto px-4">
            <Suspense fallback={<CommunityLoadingSkeleton />}>
              <CommunityContainer />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />

      {/* Fixed Audio Player */}
      <div className="fixed bottom-4 left-2 right-2 md:left-4 md:right-4 z-40">
        <div className="container max-w-4xl mx-auto">
          <AudioPlayerContainer />
        </div>
      </div>
    </div>
  )
}

// Loading skeleton for better UX
function CommunityLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Sidebar skeleton */}
      <div className="glass-card p-6 animate-pulse">
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-white/10 mb-4"></div>
          <div className="h-6 w-32 bg-white/10 rounded mb-2"></div>
          <div className="h-4 w-24 bg-white/10 rounded mb-4"></div>
          <div className="flex justify-center gap-4 w-full mb-4">
            <div className="text-center">
              <div className="h-5 w-8 bg-white/10 rounded mb-1 mx-auto"></div>
              <div className="h-3 w-12 bg-white/10 rounded mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="h-5 w-8 bg-white/10 rounded mb-1 mx-auto"></div>
              <div className="h-3 w-12 bg-white/10 rounded mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="h-5 w-8 bg-white/10 rounded mb-1 mx-auto"></div>
              <div className="h-3 w-12 bg-white/10 rounded mx-auto"></div>
            </div>
          </div>
          <div className="h-9 w-full bg-white/10 rounded"></div>
        </div>
      </div>

      {/* Create post skeleton */}
      <div className="glass-card p-6 animate-pulse">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-white/10"></div>
          <div className="flex-1">
            <div className="h-24 w-full bg-white/10 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-white/10 rounded"></div>
                <div className="h-8 w-16 bg-white/10 rounded"></div>
                <div className="h-8 w-16 bg-white/10 rounded"></div>
              </div>
              <div className="h-8 w-20 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card p-6 animate-pulse">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-white/10"></div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <div className="h-5 w-32 bg-white/10 rounded"></div>
                <div className="h-5 w-16 bg-white/10 rounded"></div>
              </div>
              <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
              <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-white/10 rounded mb-4"></div>
              <div className="h-40 w-full bg-white/10 rounded mb-4"></div>
              <div className="flex gap-4">
                <div className="h-8 w-16 bg-white/10 rounded"></div>
                <div className="h-8 w-16 bg-white/10 rounded"></div>
                <div className="h-8 w-16 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

