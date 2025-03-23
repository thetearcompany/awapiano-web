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
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-indigo-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: Math.random() * 0.5 + 0.3
                }}
                animate={{
                  y: [null, "-20%"],
                  opacity: [null, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-secondary/90 text-black mb-4 backdrop-blur-sm">Now Streaming</Badge>
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Experience the Soul of South Africa
              </motion.h1>
              <motion.p
                className="text-xl mb-8 text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Discover the vibrant rhythm and culture of Amapiano music. Stream live, shop exclusive beats, and
                connect with the community.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button className="bg-primary/90 hover:bg-primary text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 glow-hover glow-green">
                  Listen Now <Headphones className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 glow-hover">
                  Explore Talent
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Latest Drops Section */}
        <section className="py-16 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Latest Drops</h2>
              <Button variant="link" className="text-secondary hover:text-secondary/80 transition-colors">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="glass-card overflow-hidden group hover:border-secondary/50 transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="relative aspect-square bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20">
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button className="rounded-full h-14 w-14 bg-secondary/90 text-black hover:bg-secondary backdrop-blur-sm transform hover:scale-110 transition-all duration-300">
                          <Play className="h-6 w-6 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 backdrop-blur-sm">
                      <h3 className="font-bold truncate">Amapiano Fusion Vol. {item}</h3>
                      <p className="text-sm text-muted-foreground">DJ Stokie</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="bg-white/5 hover:bg-white/10 transition-colors">
                          New Release
                        </Badge>
                        <span className="text-xs text-muted-foreground">03:24</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Artists */}
        <section className="py-16 bg-gradient-to-b from-black to-black/95 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Featured Artists</h2>
              <Button variant="link" className="text-secondary hover:text-secondary/80 transition-colors">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href="#" className="flex flex-col items-center text-center group">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-secondary transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20 group-hover:scale-110 transition-transform duration-300"></div>
                      <div className="absolute inset-0 backdrop-blur-sm group-hover:backdrop-blur-none transition-all duration-300"></div>
                    </div>
                    <h3 className="font-medium text-sm group-hover:text-secondary transition-colors">DJ Maphorisa</h3>
                    <p className="text-xs text-muted-foreground group-hover:text-white/80 transition-colors">Producer</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Now */}
        <section className="py-16 bg-black/95 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-gradient-to-br from-secondary/20 via-primary/20 to-accent/20 rounded-full blur-3xl opacity-30"></div>
          </div>

          <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <motion.div
              className="flex items-center gap-2 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <TrendingUp className="h-6 w-6 text-secondary" />
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Trending Now</h2>
            </motion.div>

            <Tabs defaultValue="tracks" className="w-full">
              <TabsList className="glass mb-6 backdrop-blur-sm border border-white/10">
                <TabsTrigger value="tracks" className="data-[state=active]:bg-white/10">Top Tracks</TabsTrigger>
                <TabsTrigger value="artists" className="data-[state=active]:bg-white/10">Top Artists</TabsTrigger>
                <TabsTrigger value="playlists" className="data-[state=active]:bg-white/10">Playlists</TabsTrigger>
              </TabsList>

              <TabsContent value="tracks" className="space-y-4">
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="glass-card p-3 flex items-center gap-4 hover:border-secondary/50 transition-all duration-300 group backdrop-blur-sm">
                      <div className="font-bold text-secondary w-6 text-center">{item}</div>
                      <div className="h-12 w-12 rounded bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors duration-300"></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate group-hover:text-secondary transition-colors">Asibe Happy (feat. Boohle)</h3>
                        <p className="text-sm text-muted-foreground truncate group-hover:text-white/80 transition-colors">Kabza De Small & DJ Maphorisa</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">03:42</span>
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-secondary/20 transition-colors">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
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
        <section className="py-16 bg-gradient-to-b from-black/95 to-black relative overflow-hidden">
          <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <motion.div
              className="glass-card p-8 relative overflow-hidden backdrop-blur-sm border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-32 -mb-32 animate-pulse delay-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-transparent"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Badge className="bg-accent/90 text-white mb-4 backdrop-blur-sm">Join the Movement</Badge>
                  <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">
                    Become Part of the Amapiano Community
                  </h2>
                  <p className="text-white/80 mb-6">
                    Share your mixes, connect with other artists, and get exclusive access to events and releases.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-secondary/90 hover:bg-secondary text-black backdrop-blur-sm transition-all duration-300 hover:scale-105 glow-hover">
                      Sign Up Free
                    </Button>
                    <Button variant="outline" className="border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                      Learn More
                    </Button>
                  </div>
                </motion.div>
                <motion.div
                  className="relative h-48 w-48"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent animate-spin-slow"></div>
                  <div className="absolute inset-2 rounded-full bg-black"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-16 w-16 text-white animate-pulse" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 bg-black relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl opacity-30"></div>
          </div>

          <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-secondary" />
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  Upcoming Events
                </h2>
              </div>
              <Button variant="link" className="text-secondary hover:text-secondary/80 transition-colors">
                View Calendar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <div className="space-y-4">
              {[1, 2, 3].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 group hover:border-secondary/50 transition-all duration-300 backdrop-blur-sm">
                    <div className="sm:w-32 flex-shrink-0 flex flex-col items-center justify-center p-3 bg-gradient-to-br from-secondary/20 via-primary/20 to-accent/20 rounded-lg group-hover:from-secondary/30 group-hover:via-primary/30 group-hover:to-accent/30 transition-colors duration-300">
                      <span className="text-2xl font-bold text-secondary">23</span>
                      <span className="text-sm text-white/80">June</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-secondary transition-colors">Amapiano Summer Festival</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Clock className="h-4 w-4" />
                        <span>8:00 PM - 2:00 AM</span>
                      </div>
                      <p className="text-sm text-white/80 mb-4 group-hover:text-white transition-colors">
                        Join us for the biggest Amapiano event of the summer featuring top DJs and artists from South
                        Africa.
                      </p>
                      <div className="flex items-center gap-3">
                        <Button size="sm" className="bg-primary/90 hover:bg-primary text-white backdrop-blur-sm transition-all duration-300 hover:scale-105">
                          Get Tickets
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                          Add to Calendar
                        </Button>
                      </div>
                    </div>
                    <div className="sm:w-24 flex-shrink-0 flex items-center justify-center">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((avatar) => (
                          <Avatar key={avatar} className="border-2 border-black h-8 w-8 transition-transform hover:scale-110">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20"></div>
                            <AvatarFallback className="bg-primary/20 text-xs backdrop-blur-sm">SA</AvatarFallback>
                          </Avatar>
                        ))}
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs backdrop-blur-sm">
                          +42
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
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

      {/* Add keyframes for slow spin animation */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

