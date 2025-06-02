import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">MindBloom</h3>
            <p className="text-sm text-muted-foreground">
              Virtual support for mental wellness using cognitive behavioral therapy techniques.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/mood-tracking" className="text-sm text-muted-foreground hover:text-primary">
                  Mood Tracking
                </Link>
              </li>
              <li>
                <Link href="/services/calm-music" className="text-sm text-muted-foreground hover:text-primary">
                  Calm Music
                </Link>
              </li>
              <li>
                <Link href="/services/journaling" className="text-sm text-muted-foreground hover:text-primary">
                  Journaling
                </Link>
              </li>
              <li>
                <Link href="/services/insights" className="text-sm text-muted-foreground hover:text-primary">
                  Insights
                </Link>
              </li>
              <li>
                <Link href="/services/exercises" className="text-sm text-muted-foreground hover:text-primary">
                  Exercises
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Connect With Us</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="text-xs text-center text-muted-foreground">
            © {new Date().getFullYear()} MindBloom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
