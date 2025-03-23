import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AudioPlayer } from "@/components/audio-player"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, Download, Heart, Headphones, ListMusic, Mic2, Play, Radio, Share2 } from "lucide-react"
import Image from "next/image"

export default function RadioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black z-0"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-50 z-[-1]"></div>

          <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Radio className="h-6 w-6 text-secondary" />
                <h1 className="text-3xl md:text-4xl font-bold">Amapiano Radio</h1>
              </div>
              <p className="text-xl mb-8 text-white/80">
                Stream live shows, catch up on past episodes, and discover new talent from South Africa and beyond.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-white glow-hover glow-green">
                  Listen Live <Headphones className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/10 glow-hover">
                  Show Schedule
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Now Playing */}
        <section className="py-12 bg-black">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="glass-card p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="relative aspect-square rounded-xl overflow-hidden glow-yellow">
                    <Image
                      src="/placeholder.svg?height=400&width=400"
                      alt="Now playing"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-accent text-white">LIVE</Badge>
                    <span className="text-sm text-muted-foreground">12:00 - 14:00</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">The Midday Mix</h2>
                  <p className="text-lg mb-4">with DJ Stokie</p>
                  <p className="text-white/80 mb-6">
                    Join DJ Stokie for two hours of the freshest Amapiano tracks, exclusive premieres, and special guest
                    interviews.
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="DJ Stokie" />
                      <AvatarFallback className="bg-primary">DS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold">DJ Stokie</h3>
                      <p className="text-sm text-muted-foreground">Producer & Radio Host</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-auto">
                    <Button className="bg-secondary hover:bg-secondary/90 text-black">
                      <Headphones className="mr-2 h-4 w-4" /> Listen Now
                    </Button>
                    <Button variant="outline" className="border-white/20 hover:bg-white/10">
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button variant="ghost" className="text-white">
                      <Heart className="mr-2 h-4 w-4" /> Favorite
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Show Schedule */}
        <section className="py-12 bg-gradient-to-b from-black to-black/95">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-secondary" />
                <h2 className="text-2xl font-bold">Show Schedule</h2>
              </div>
              <Button variant="link" className="text-secondary">
                Full Schedule <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="monday" className="w-full">
              <TabsList className="glass mb-6 w-full justify-start overflow-auto">
                <TabsTrigger value="monday">Monday</TabsTrigger>
                <TabsTrigger value="tuesday">Tuesday</TabsTrigger>
                <TabsTrigger value="wednesday">Wednesday</TabsTrigger>
                <TabsTrigger value="thursday">Thursday</TabsTrigger>
                <TabsTrigger value="friday">Friday</TabsTrigger>
                <TabsTrigger value="saturday">Saturday</TabsTrigger>
                <TabsTrigger value="sunday">Sunday</TabsTrigger>
              </TabsList>

              <TabsContent value="monday" className="space-y-4">
                {[
                  { time: "06:00 - 09:00", show: "Morning Groove", host: "DJ Zinhle" },
                  { time: "09:00 - 12:00", show: "Amapiano Workday", host: "Kabza De Small" },
                  { time: "12:00 - 14:00", show: "The Midday Mix", host: "DJ Stokie", live: true },
                  { time: "14:00 - 16:00", show: "Afternoon Sessions", host: "DBN Gogo" },
                  { time: "16:00 - 19:00", show: "Drive Time", host: "Major League DJz" },
                  { time: "19:00 - 22:00", show: "Evening Vibes", host: "DJ Maphorisa" },
                  { time: "22:00 - 00:00", show: "Late Night Piano", host: "Vigro Deep" },
                ].map((slot, index) => (
                  <div
                    key={index}
                    className={`glass-card p-4 flex items-center gap-4 ${slot.live ? "border-accent" : ""}`}
                  >
                    <div className="w-32 flex-shrink-0">
                      <span className="text-sm font-medium">{slot.time}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{slot.show}</h3>
                        {slot.live && <Badge className="bg-accent text-white">LIVE</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">with {slot.host}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Headphones className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </TabsContent>

              {/* Other days would have similar content */}
              {["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                <TabsContent key={day} value={day} className="space-y-4">
                  <div className="glass-card p-8 text-center">
                    <p>Schedule for {day.charAt(0).toUpperCase() + day.slice(1)}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* DJ Profiles */}
        <section className="py-12 bg-black/95">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Mic2 className="h-6 w-6 text-secondary" />
                <h2 className="text-2xl font-bold">Meet Our DJs</h2>
              </div>
              <Button variant="link" className="text-secondary">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="glass-card overflow-hidden glow-hover">
                  <div className="relative aspect-[3/4]">
                    <Image src={`/placeholder.svg?height=600&width=450`} alt="DJ" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-xl">DJ Maphorisa</h3>
                      <p className="text-sm text-white/80">Producer & Radio Host</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-white/80 mb-4">
                      One of South Africa's most influential producers and DJs, known for pioneering the Amapiano sound.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Show: Evening Vibes</span>
                      <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/10">
                        Profile
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Episodes */}
        <section className="py-12 bg-gradient-to-b from-black/95 to-black">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <ListMusic className="h-6 w-6 text-secondary" />
                <h2 className="text-2xl font-bold">Recent Episodes</h2>
              </div>
              <Button variant="link" className="text-secondary">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="glass-card p-4 flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-32 h-32 flex-shrink-0 relative rounded-lg overflow-hidden">
                    <Image src={`/placeholder.svg?height=128&width=128`} alt="Episode" fill className="object-cover" />
                    <Button className="absolute inset-0 m-auto rounded-full h-10 w-10 bg-secondary/80 text-black hover:bg-secondary">
                      <Play className="h-5 w-5 ml-0.5" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">June 15, 2023</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">2h 15m</span>
                    </div>
                    <h3 className="font-bold text-lg mb-1">The Midday Mix with DJ Stokie</h3>
                    <p className="text-sm text-white/80 mb-3">
                      Special guest interview with Kabza De Small discussing his latest album and the future of
                      Amapiano.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-white/5">
                        Interview
                      </Badge>
                      <Badge variant="outline" className="bg-white/5">
                        New Releases
                      </Badge>
                      <Badge variant="outline" className="bg-white/5">
                        Exclusive Mix
                      </Badge>
                    </div>
                  </div>
                  <div className="sm:w-24 flex-shrink-0 flex flex-col gap-2">
                    <Button size="sm" variant="ghost" className="w-full justify-start">
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button size="sm" variant="ghost" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" /> Save
                    </Button>
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

