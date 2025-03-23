import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AudioPlayer } from "@/components/audio-player"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Award,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  Heart,
  MessageCircle,
  Play,
  Share2,
  Sparkles,
  Star,
  ThumbsUp,
  Trophy,
  Upload,
} from "lucide-react"
import Image from "next/image"

export default function TalentPage() {
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
                <Sparkles className="h-6 w-6 text-secondary" />
                <h1 className="text-3xl md:text-4xl font-bold">Talent Showcase</h1>
              </div>
              <p className="text-xl mb-8 text-white/80">
                Discover emerging Amapiano talent, share your own creations, and get feedback from the community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-white glow-hover glow-green">
                  <Upload className="mr-2 h-4 w-4" /> Submit Your Mix
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/10 glow-hover">
                  Browse Submissions
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Spotlight */}
        <section className="py-12 bg-black">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Trophy className="h-6 w-6 text-secondary" />
              <h2 className="text-2xl font-bold">Weekly Spotlight</h2>
            </div>

            <Card className="glass-card overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative aspect-square md:aspect-auto">
                  <Image
                    src="/placeholder.svg?height=600&width=600"
                    alt="Spotlight artist"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col">
                  <Badge className="self-start bg-secondary text-black mb-4">Spotlight Artist</Badge>
                  <h3 className="text-2xl font-bold mb-2">DJ Soulful</h3>
                  <p className="text-lg text-muted-foreground mb-4">Johannesburg, South Africa</p>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-black text-xs"
                        >
                          ★
                        </div>
                      ))}
                    </div>
                    <span className="text-sm">5.0 (124 ratings)</span>
                  </div>

                  <p className="text-white/80 mb-6">
                    Rising star DJ Soulful brings a fresh perspective to the Amapiano scene, blending traditional piano
                    melodies with innovative electronic elements. His unique sound has been gaining attention across
                    South Africa.
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      <Play className="mr-2 h-4 w-4" /> Listen Now
                    </Button>
                    <Button variant="outline" className="border-white/20 hover:bg-white/10">
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                  </div>

                  <div className="mt-auto">
                    <h4 className="font-bold mb-2">Featured Track: "Sunset in Soweto"</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>4:32</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Released: June 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Recent Submissions */}
        <section className="py-12 bg-gradient-to-b from-black to-black/95">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Recent Submissions</h2>
              <Button variant="link" className="text-secondary">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="glass mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="mixes">Mixes</TabsTrigger>
                <TabsTrigger value="originals">Originals</TabsTrigger>
                <TabsTrigger value="remixes">Remixes</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0 space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <Card key={item} className="glass-card p-4 flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-32 h-32 flex-shrink-0 relative rounded-lg overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=128&width=128`}
                        alt="Submission"
                        fill
                        className="object-cover"
                      />
                      <Button className="absolute inset-0 m-auto rounded-full h-10 w-10 bg-secondary/80 text-black hover:bg-secondary">
                        <Play className="h-5 w-5 ml-0.5" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold">Summer Vibes Mix</h3>
                        <Badge variant="outline" className="bg-white/5">
                          {item % 2 === 0 ? "Original" : "Mix"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-6 w-6 border">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Artist" />
                          <AvatarFallback className="bg-primary text-xs">DJ</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">DJ Rhythm</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>5:42</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>2 days ago</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
                            <Heart className="h-4 w-4" /> 124
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
                            <MessageCircle className="h-4 w-4" /> 18
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
                            <Download className="h-4 w-4" /> 56
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium">4.8</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${star <= 4 ? "text-secondary fill-secondary" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Other tabs would have similar content */}
              {["mixes", "originals", "remixes"].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  <Card className="glass-card p-8 text-center">
                    <h3 className="text-xl font-bold mb-2">{tab.charAt(0).toUpperCase() + tab.slice(1)}</h3>
                    <p>Browse {tab} submitted by the community.</p>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Top Rated */}
        <section className="py-12 bg-black/95">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Award className="h-6 w-6 text-secondary" />
              <h2 className="text-2xl font-bold">Top Rated This Month</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="glass-card overflow-hidden glow-hover">
                  <div className="relative aspect-square">
                    <Image
                      src={`/placeholder.svg?height=400&width=400`}
                      alt="Top rated"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button className="rounded-full h-14 w-14 bg-secondary text-black hover:bg-secondary/90">
                        <Play className="h-6 w-6 ml-0.5" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                      #{item}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold truncate">Amapiano Sunrise</h3>
                    <p className="text-sm text-muted-foreground mb-2">by Producer Name</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 text-secondary fill-secondary" />
                        ))}
                      </div>
                      <span className="text-sm font-medium">5.0 (87)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button className="flex-1 bg-primary hover:bg-primary/90 text-white">Listen</Button>
                      <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="py-12 bg-gradient-to-b from-black/95 to-black">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Feedback Corner</h2>
              <Button variant="link" className="text-secondary">
                Submit for Feedback <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <Card className="glass-card p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                    <Image
                      src="/placeholder.svg?height=400&width=400"
                      alt="Feedback submission"
                      fill
                      className="object-cover"
                    />
                    <Button className="absolute inset-0 m-auto rounded-full h-14 w-14 bg-secondary/80 text-black hover:bg-secondary">
                      <Play className="h-6 w-6 ml-0.5" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">First Light (Demo)</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Artist" />
                        <AvatarFallback className="bg-primary text-xs">NP</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">New Producer</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>3:24</span>
                      <span>Submitted 1 day ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 gap-1">
                        <ThumbsUp className="h-3 w-3" /> Support
                      </Button>
                      <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 gap-1">
                        <Share2 className="h-3 w-3" /> Share
                      </Button>
                      <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 gap-1">
                        <ExternalLink className="h-3 w-3" /> Profile
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="font-bold text-lg mb-4">Community Feedback</h3>
                  <div className="space-y-4 mb-6">
                    {[1, 2].map((feedback) => (
                      <div key={feedback} className="glass p-4 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Reviewer" />
                            <AvatarFallback className="bg-primary text-xs">PR</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">Pro Reviewer</h4>
                              <Badge className="bg-highlight text-white text-xs">Verified Producer</Badge>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4].map((star) => (
                                <Star key={star} className="h-3 w-3 text-secondary fill-secondary" />
                              ))}
                              {[5].map((star) => (
                                <Star key={star} className="h-3 w-3 text-muted-foreground" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm mb-3">
                          Great start! The log drum pattern is solid, but I think the mix could use some work. The bass
                          is a bit overpowering and the vocals could be more prominent. Try adjusting the EQ and
                          compression.
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>12 hours ago</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                            <ThumbsUp className="h-3 w-3" /> Helpful (24)
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Rating Breakdown</h4>
                    <div className="space-y-2 mb-4">
                      {[
                        { label: "Originality", value: 85 },
                        { label: "Production Quality", value: 70 },
                        { label: "Arrangement", value: 80 },
                        { label: "Danceability", value: 90 },
                      ].map((category) => (
                        <div key={category.label} className="flex items-center gap-3">
                          <span className="text-xs w-32">{category.label}</span>
                          <Progress value={category.value} className="h-2 flex-1" />
                          <span className="text-xs w-8">{category.value}%</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">Leave Feedback</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 bg-black">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">How The Talent Showcase Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">1. Submit Your Work</h3>
                <p className="text-white/80">
                  Upload your original Amapiano tracks, mixes, or remixes to showcase your talent to the community.
                </p>
              </Card>

              <Card className="glass-card p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-black" />
                </div>
                <h3 className="font-bold text-lg mb-2">2. Get Feedback</h3>
                <p className="text-white/80">
                  Receive constructive feedback from the community and professional producers to improve your craft.
                </p>
              </Card>

              <Card className="glass-card p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">3. Gain Recognition</h3>
                <p className="text-white/80">
                  Top-rated submissions get featured on the platform and may receive opportunities for collaborations.
                </p>
              </Card>
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

