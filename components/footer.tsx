"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube, ArrowRight } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 pt-8 md:pt-12 pb-6 mt-auto">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 hover-scale">
              <div className="relative h-8 w-8 md:h-10 md:w-10 rounded-full sa-flag-gradient flex items-center justify-center">
                <span className="text-black font-bold text-base md:text-lg">A</span>
              </div>
              <span className="font-bold text-lg md:text-xl">Amapiano.fm</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              South Africa's premier platform for Amapiano music, culture, and community.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Youtube, label: "Youtube" },
              ].map((social, index) => {
                const Icon = social.icon
                return (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 hover:bg-white/5 hover:text-secondary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-secondary text-sm md:text-base">Navigation</h3>
            <ul className="space-y-2">
              {["Home", "Radio", "Shop", "Blog", "Community", "Talent"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-xs md:text-sm hover:text-secondary transition-colors flex items-center gap-1 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-secondary text-sm md:text-base">Resources</h3>
            <ul className="space-y-2">
              {["About Us", "Contact", "FAQ", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-xs md:text-sm hover:text-secondary transition-colors flex items-center gap-1 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold mb-3 text-secondary text-sm md:text-base">Newsletter</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-3">
              Subscribe to get the latest updates on new releases, events, and more.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <Input
                placeholder="Your email"
                type="email"
                className="h-9 text-sm bg-white/5 border-white/10 focus:border-secondary"
                aria-label="Email for newsletter"
                required
              />
              <Button type="submit" className="w-full h-9 bg-primary hover:bg-primary/90 text-white text-sm">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">By subscribing, you agree to our privacy policy.</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {currentYear} Amapiano.fm. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-xs text-muted-foreground hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

