import { AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@/components/ui/avatar"
import { Avatar } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AudioPlayer } from "@/components/audio-player"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ChevronDown, Download, Filter, Play, ShoppingCart, Store } from "lucide-react"
import Image from "next/image"

export default function ShopPage() {
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
                <Store className="h-6 w-6 text-secondary" />
                <h1 className="text-3xl md:text-4xl font-bold">Amapiano Shop</h1>
              </div>
              <p className="text-xl mb-8 text-white/80">
                Discover exclusive beats, sample packs, merchandise, and more from your favorite Amapiano artists.
              </p>
              <div className="relative">
                <Input
                  placeholder="Search for beats, merch, or artists..."
                  className="bg-white/10 border-white/20 focus:border-secondary pl-4 pr-12 py-6 text-lg"
                />
                <Button className="absolute right-1 top-1 bottom-1 bg-secondary hover:bg-secondary/90 text-black">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Shop Categories */}
        <section className="py-12 bg-black">
          <div className="container max-w-4xl mx-auto px-4">
            <Tabs defaultValue="beats" className="w-full">
              <TabsList className="glass mb-8 w-full justify-start overflow-auto">
                <TabsTrigger value="beats">Beats & Instrumentals</TabsTrigger>
                <TabsTrigger value="samples">Sample Packs</TabsTrigger>
                <TabsTrigger value="merch">Merchandise</TabsTrigger>
                <TabsTrigger value="vinyl">Vinyl & CDs</TabsTrigger>
              </TabsList>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="md:w-64 flex-shrink-0">
                  <div className="glass-card p-4 sticky top-20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Filters</h3>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm" className="md:hidden">
                            <Filter className="h-4 w-4 mr-2" /> Filters
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="glass border-r border-white/10 w-[300px]">
                          <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                            <SheetDescription>Narrow down your search with these filters.</SheetDescription>
                          </SheetHeader>
                          <div className="py-4">
                            {/* Mobile filters - same as desktop */}
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-sm font-medium mb-3">Price Range</h4>
                                <Slider defaultValue={[0, 100]} max={100} step={1} className="mb-2" />
                                <div className="flex items-center justify-between">
                                  <span className="text-xs">R0</span>
                                  <span className="text-xs">R1000</span>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-3">BPM</h4>
                                <div className="flex gap-2">
                                  <Input type="number" placeholder="Min" className="bg-white/5 border-white/10" />
                                  <Input type="number" placeholder="Max" className="bg-white/5 border-white/10" />
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-3">Key</h4>
                                <Select>
                                  <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Select key" />
                                  </SelectTrigger>
                                  <SelectContent className="glass border-white/10">
                                    <SelectItem value="c-major">C Major</SelectItem>
                                    <SelectItem value="a-minor">A Minor</SelectItem>
                                    <SelectItem value="g-major">G Major</SelectItem>
                                    <SelectItem value="e-minor">E Minor</SelectItem>
                                    <SelectItem value="f-major">F Major</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-3">Artists</h4>
                                <div className="space-y-2">
                                  {["Kabza De Small", "DJ Maphorisa", "Vigro Deep", "DBN Gogo", "Major League DJz"].map(
                                    (artist) => (
                                      <div key={artist} className="flex items-center">
                                        <Checkbox id={`artist-${artist}`} />
                                        <label
                                          htmlFor={`artist-${artist}`}
                                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                          {artist}
                                        </label>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-3">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                  {["Exclusive", "New", "Bestseller", "Sale", "Premium"].map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="bg-white/5 hover:bg-white/10 cursor-pointer"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                                Apply Filters
                              </Button>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>

                    {/* Desktop Filters */}
                    <div className="hidden md:block space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Price Range</h4>
                        <Slider defaultValue={[0, 100]} max={100} step={1} className="mb-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-xs">R0</span>
                          <span className="text-xs">R1000</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-3">BPM</h4>
                        <div className="flex gap-2">
                          <Input type="number" placeholder="Min" className="bg-white/5 border-white/10" />
                          <Input type="number" placeholder="Max" className="bg-white/5 border-white/10" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-3">Key</h4>
                        <Select>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Select key" />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/10">
                            <SelectItem value="c-major">C Major</SelectItem>
                            <SelectItem value="a-minor">A Minor</SelectItem>
                            <SelectItem value="g-major">G Major</SelectItem>
                            <SelectItem value="e-minor">E Minor</SelectItem>
                            <SelectItem value="f-major">F Major</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-3">Artists</h4>
                        <div className="space-y-2">
                          {["Kabza De Small", "DJ Maphorisa", "Vigro Deep", "DBN Gogo", "Major League DJz"].map(
                            (artist) => (
                              <div key={artist} className="flex items-center">
                                <Checkbox id={`desktop-artist-${artist}`} />
                                <label
                                  htmlFor={`desktop-artist-${artist}`}
                                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {artist}
                                </label>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {["Exclusive", "New", "Bestseller", "Sale", "Premium"].map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-white/5 hover:bg-white/10 cursor-pointer">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">Apply Filters</Button>
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                  <TabsContent value="beats" className="mt-0">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Beats & Instrumentals</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Sort by:</span>
                        <Select defaultValue="newest">
                          <SelectTrigger className="bg-white/5 border-white/10 w-[140px]">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/10">
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="popular">Most Popular</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Card key={item} className="glass-card overflow-hidden glow-hover">
                          <div className="relative aspect-square">
                            <Image
                              src={`/placeholder.svg?height=400&width=400`}
                              alt="Beat cover"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button className="rounded-full h-14 w-14 bg-secondary text-black hover:bg-secondary/90">
                                <Play className="h-6 w-6 ml-0.5" />
                              </Button>
                            </div>
                            <Badge className="absolute top-2 right-2 bg-accent text-white">New</Badge>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold truncate">Sunset in Soweto</h3>
                              <span className="font-bold text-secondary">R250</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">by DJ Maphorisa</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                              <span>120 BPM</span>
                              <span>A Minor</span>
                              <span>3:45</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button className="flex-1 bg-primary hover:bg-primary/90 text-white">
                                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                              </Button>
                              <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <div className="flex items-center justify-center mt-8">
                      <Button variant="outline" className="border-white/20 hover:bg-white/10">
                        Load More <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="samples" className="mt-0">
                    <div className="glass-card p-8 text-center">
                      <h3 className="text-xl font-bold mb-2">Sample Packs</h3>
                      <p>Browse our collection of premium Amapiano sample packs.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="merch" className="mt-0">
                    <div className="glass-card p-8 text-center">
                      <h3 className="text-xl font-bold mb-2">Merchandise</h3>
                      <p>Official Amapiano.fm and artist merchandise.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="vinyl" className="mt-0">
                    <div className="glass-card p-8 text-center">
                      <h3 className="text-xl font-bold mb-2">Vinyl & CDs</h3>
                      <p>Physical copies of your favorite Amapiano albums.</p>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 bg-gradient-to-b from-black to-black/95">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Button variant="link" className="text-secondary">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card overflow-hidden col-span-1 md:col-span-2 glow-hover">
                <div className="relative aspect-[2/1]">
                  <Image
                    src={`/placeholder.svg?height=400&width=800`}
                    alt="Featured product"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge className="bg-secondary text-black mb-2">Limited Edition</Badge>
                    <h3 className="font-bold text-2xl mb-1">Amapiano Producer Bundle</h3>
                    <p className="text-white/80 mb-4">
                      Complete production toolkit with samples, presets, and video tutorials.
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-secondary">R1,499</span>
                      <span className="text-sm line-through text-muted-foreground">R1,999</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Creator" />
                      <AvatarFallback className="bg-primary">AM</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">By Amapiano Masters</span>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </div>
              </Card>

              <div className="space-y-6">
                {[1, 2].map((item) => (
                  <Card key={item} className="glass-card overflow-hidden glow-hover">
                    <div className="relative aspect-square">
                      <Image
                        src={`/placeholder.svg?height=300&width=300`}
                        alt="Product"
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-accent text-white">25% OFF</Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold">Amapiano T-Shirt</h3>
                      <p className="text-sm text-muted-foreground mb-2">Premium cotton with custom print</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">R349</span>
                          <span className="text-sm line-through text-muted-foreground">R449</span>
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 bg-black/95">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">What Producers Say</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="glass-card p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-secondary">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-white/80 mb-6 flex-1">
                      "These sample packs have completely transformed my production workflow. The authentic Amapiano
                      sounds are exactly what I needed for my latest project."
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Customer" />
                        <AvatarFallback className="bg-primary">JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">John Doe</h4>
                        <p className="text-xs text-muted-foreground">Producer, Johannesburg</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
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

