import { Link } from "react-router-dom"
import { Github, Twitter, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/80">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="text-sm font-semibold tracking-tight">CBG Connect</div>
            <p className="max-w-md text-xs text-muted-foreground sm:text-sm">
              A modern gateway for secure access, authentication, and account management.
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-8 text-xs sm:text-sm">
            <div className="space-y-2">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Product
              </div>
              <div className="flex flex-col gap-1 text-muted-foreground">
                <Link to="/features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link to="/pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link to="/status" className="hover:text-foreground transition-colors">
                  Status
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Company
              </div>
              <div className="flex flex-col gap-1 text-muted-foreground">
                <Link to="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
                <Link to="/security" className="hover:text-foreground transition-colors">
                  Security
                </Link>
                <Link to="/support" className="hover:text-foreground transition-colors">
                  Support
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Connect
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon-sm" className="rounded-full" asChild>
                  <a href="https://github.com" target="_blank" rel="noreferrer">
                    <Github className="size-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon-sm" className="rounded-full" asChild>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer">
                    <Twitter className="size-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon-sm" className="rounded-full" asChild>
                  <a href="mailto:support@example.com">
                    <Mail className="size-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col items-start justify-between gap-2 text-[0.7rem] text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} CBG Connect. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
