import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AudioPlayer } from "@/components/audio-player"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, BookOpen, Calendar, ChevronRight, Clock, Search, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative h-[40vh] min-h-[300px] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black z-0"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-50 z-[-1]"></div>

          <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-secondary" />
                <h1 className="text-3xl md:text-4xl font-bold">Amapiano Blog</h1>
              </div>
              <p className="text-xl mb-8 text-white/80">
                News, interviews, features, and stories from the world of Amapiano music and culture.
              </p>
              <div className="relative">
                <Input
                  placeholder="Search articles..."
                  className="bg-white/10 border-white/20 focus:border-secondary pl-12 py-6 text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        <section className="py-12 bg-black">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Featured Article</h2>

            <Card className="glass-card overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative aspect-square md:aspect-auto">
                  <Image
                    src="/placeholder.svg?height=600&width=600"
                    alt="Featured article"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col">
                  <Badge className="self-start bg-highlight text-white mb-4">Interview</Badge>
                  <h3 className="text-2xl font-bold mb-2">
                    The Rise of Amapiano: How South Africa's Sound Conquered the World
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">June 15, 2023</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">10 min read</span>
                    </div>
                  </div>
                  <p className="text-white/80 mb-6">
                    We sit down with the pioneers of the Amapiano movement to discuss how this uniquely South African
                    sound has captured global attention and what's next for the genre.
                  </p>
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Author" />
                      <AvatarFallback className="bg-primary">SA</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Sarah Adams</h4>
                      <p className="text-xs text-muted-foreground">Music Journalist</p>
                    </div>
                  </div>
                  <Button className="self-start mt-auto bg-primary hover:bg-primary/90 text-white">
                    Read Article <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Latest Articles */}
        <section className="py-12 bg-gradient-to-b from-black to-black/95">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Latest Articles</h2>
              <Button variant="link" className="text-secondary">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="glass-card overflow-hidden glow-hover">
                  <div className="relative aspect-[4/3]">
                    <Image src={`/placeholder.svg?height=300&width=400`} alt="Article" fill className="object-cover" />
                    <Badge className="absolute top-2 right-2 bg-accent text-white">New</Badge>
                  </div>
                  <div className="p-4">
                    <Badge variant="outline" className="bg-white/5 mb-2">
                      Feature
                    </Badge>
                    <h3 className="font-bold text-lg mb-2">Top 10 Amapiano Tracks of 2023 So Far</h3>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">June 10, 2023</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">5 min read</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/80 mb-4 line-clamp-3">
                      We count down the most impactful Amapiano releases that have defined the sound in 2023, from
                      chart-toppers to underground gems.
                    </p>
                    <Link href="#" className="text-secondary text-sm font-medium hover:underline">
                      Read More <ChevronRight className="inline h-3 w-3" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories and Tags */}
        <section className="py-12 bg-black/95">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  <h2 className="text-xl font-bold">Categories</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {["Interviews", "Features", "News", "Reviews", "Tutorials", "Events", "Culture", "Industry"].map(
                    (category) => (
                      <Link
                        key={category}
                        href="#"
                        className="glass-card p-3 flex items-center justify-between hover:border-secondary transition-colors"
                      >
                        <span>{category}</span>
                        <ChevronRight className="h-4 w-4 text-secondary" />
                      </Link>
                    ),
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="h-5 w-5 text-secondary" />
                  <h2 className="text-xl font-bold">Popular Tags</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Amapiano",
                    "South Africa",
                    "DJ Maphorisa",
                    "Kabza De Small",
                    "Log Drum",
                    "Piano",
                    "Johannesburg",
                    "Dance",
                    "Culture",
                    "Music Production",
                    "Samples",
                    "Tutorial",
                    "Festival",
                    "Vinyl",
                    "Streaming",
                    "Charts",
                  ].map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-white/5 hover:bg-white/10 cursor-pointer py-1.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 bg-gradient-to-b from-black/95 to-black">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-highlight/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

              <div className="relative z-10 text-center max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                <p className="text-white/80 mb-6">
                  Get the latest Amapiano news, features, and interviews delivered straight to your inbox.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Your email address"
                    className="bg-white/10 border-white/20 focus:border-secondary"
                  />
                  <Button className="bg-secondary hover:bg-secondary/90 text-black">Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Fixed Audio Player */}
      <div className="fixed bottom-4 left-4 right-4 z-40">
        <div className="container max-w-4xl mx-auto">
          <AudioPlayer isMinimized={true} />
        </div>
      </div>
    </div>
  )
}

