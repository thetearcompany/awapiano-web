import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AudioPlayer } from "@/components/audio-player"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, Clock, Headphones, Play, Sparkles, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black z-0"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-50 z-[-1]"></div>

          <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <Badge className="bg-secondary text-black mb-4">Now Streaming</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Experience the Soul of South Africa</h1>
              <p className="text-xl mb-8 text-white/80">
                Discover the vibrant rhythm and culture of Amapiano music. Stream live, shop exclusive beats, and
                connect with the community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-white glow-hover glow-green">
                  Listen Now <Headphones className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/10 glow-hover">
                  Explore Talent
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Drops Section */}
        <section className="py-16 bg-black">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Latest Drops</h2>
              <Button variant="link" className="text-secondary">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="glass-card overflow-hidden glow-hover">
                  <div className="relative aspect-square">
                    <Image
                      src={`/placeholder.svg?height=400&width=400`}
                      alt="Album cover"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button className="rounded-full h-14 w-14 bg-secondary text-black hover:bg-secondary/90">
                        <Play className="h-6 w-6 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold truncate">Amapiano Fusion Vol. 3</h3>
                    <p className="text-sm text-muted-foreground">DJ Stokie</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="bg-white/5">
                        New Release
                      </Badge>
                      <span className="text-xs text-muted-foreground">03:24</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Artists */}
        <section className="py-16 bg-gradient-to-b from-black to-black/95">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Featured Artists</h2>
              <Button variant="link" className="text-secondary">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map((item) => (
                <Link href="#" key={item} className="flex flex-col items-center text-center group">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-secondary transition-colors">
                    <Image src={`/placeholder.svg?height=96&width=96`} alt="Artist" fill className="object-cover" />
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-secondary transition-colors">DJ Maphorisa</h3>
                  <p className="text-xs text-muted-foreground">Producer</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Now */}
        <section className="py-16 bg-black/95">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="h-6 w-6 text-secondary" />
              <h2 className="text-2xl font-bold">Trending Now</h2>
            </div>

            <Tabs defaultValue="tracks" className="w-full">
              <TabsList className="glass mb-6">
                <TabsTrigger value="tracks">Top Tracks</TabsTrigger>
                <TabsTrigger value="artists">Top Artists</TabsTrigger>
                <TabsTrigger value="playlists">Playlists</TabsTrigger>
              </TabsList>

              <TabsContent value="tracks" className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="glass-card p-3 flex items-center gap-4 hover:border-secondary/50 transition-colors"
                  >
                    <div className="font-bold text-secondary w-6 text-center">{item}</div>
                    <div className="h-12 w-12 rounded bg-gradient-to-br from-primary to-secondary flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">Asibe Happy (feat. Boohle)</h3>
                      <p className="text-sm text-muted-foreground truncate">Kabza De Small & DJ Maphorisa</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">03:42</span>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="artists" className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <Link href="#" key={item} className="flex flex-col items-center text-center group">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-secondary transition-colors">
                      <Image src={`/placeholder.svg?height=80&width=80`} alt="Artist" fill className="object-cover" />
                    </div>
                    <h3 className="font-medium text-sm group-hover:text-secondary transition-colors">Artist Name</h3>
                    <p className="text-xs text-muted-foreground">1.2M plays</p>
                  </Link>
                ))}
              </TabsContent>

              <TabsContent value="playlists" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <Card key={item} className="glass-card overflow-hidden glow-hover">
                    <div className="relative aspect-square">
                      <Image
                        src={`/placeholder.svg?height=400&width=400`}
                        alt="Playlist cover"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button className="rounded-full h-14 w-14 bg-secondary text-black hover:bg-secondary/90">
                          <Play className="h-6 w-6 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold truncate">Weekend Vibes</h3>
                      <p className="text-sm text-muted-foreground">Curated by Amapiano.fm</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">32 tracks</span>
                        <span className="text-xs text-muted-foreground">2hr 15min</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-b from-black/95 to-black">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <Badge className="bg-accent text-white mb-4">Join the Movement</Badge>
                  <h2 className="text-3xl font-bold mb-4">Become Part of the Amapiano Community</h2>
                  <p className="text-white/80 mb-6">
                    Share your mixes, connect with other artists, and get exclusive access to events and releases.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-secondary hover:bg-secondary/90 text-black glow-hover">Sign Up Free</Button>
                    <Button variant="outline" className="border-white/20 hover:bg-white/10">
                      Learn More
                    </Button>
                  </div>
                </div>
                <div className="relative h-48 w-48 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-yellow">
                  <Sparkles className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 bg-black">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-secondary" />
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
              </div>
              <Button variant="link" className="text-secondary">
                View Calendar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="glass-card p-4 flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-32 flex-shrink-0 flex flex-col items-center justify-center p-3 bg-white/5 rounded-lg">
                    <span className="text-2xl font-bold text-secondary">23</span>
                    <span className="text-sm">June</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Amapiano Summer Festival</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="h-4 w-4" />
                      <span>8:00 PM - 2:00 AM</span>
                    </div>
                    <p className="text-sm text-white/80 mb-4">
                      Join us for the biggest Amapiano event of the summer featuring top DJs and artists from South
                      Africa.
                    </p>
                    <div className="flex items-center gap-3">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                        Get Tickets
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/10">
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                  <div className="sm:w-24 flex-shrink-0 flex items-center justify-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((avatar) => (
                        <Avatar key={avatar} className="border-2 border-black h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="Attendee" />
                          <AvatarFallback className="bg-primary text-xs">SA</AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                        +42
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Fixed Audio Player */}
      <div className="fixed bottom-4 left-4 right-4 z-40">
        <div className="container max-w-4xl mx-auto">
          <AudioPlayer />
        </div>
      </div>
    </div>
  )
}

