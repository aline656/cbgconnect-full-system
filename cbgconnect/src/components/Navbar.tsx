import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ShieldCheck, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import { clearAuthToken, getAuthToken } from "@/lib/api"

function getDashboardPathForRole(role: unknown) {
  const r = typeof role === "string" ? role : ""
  const mapping: Record<string, string> = {
    parent: "/parent",
    secretary: "/secretary",
    teacher: "/teacher",
    metron: "/metron",
    patron: "/patron",
    admin: "/admin",
  }
  return mapping[r] ?? "/"
}

function parseTokenPayload(token: string | null) {
  if (!token) return null
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const json = JSON.parse(atob(base64))
    return json
  } catch {
    return null
  }
}

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(() => getAuthToken())

  useEffect(() => {
    setToken(getAuthToken())
  }, [location.pathname])

  useEffect(() => {
    const onStorage = () => setToken(getAuthToken())
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const payload = useMemo(() => parseTokenPayload(token), [token])
  const role = payload?.role
  const isLoggedIn = Boolean(payload)
  const dashboardPath = getDashboardPathForRole(role)

  const handleLogout = () => {
    clearAuthToken()
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("adminName")
    setToken(null)
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="size-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight sm:text-base">
              CBG Connect
            </span>
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Secure Portal
            </span>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-4">
          <nav className="hidden md:flex">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                {isLoggedIn ? (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          to={dashboardPath}
                          className="text-foreground/80 data-[active=true]:text-foreground px-3 py-1.5 text-sm font-medium"
                        >
                          Dashboard
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    {role === "admin" ? (
                      <>
                        <NavigationMenuItem>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/admin/users"
                              className="text-foreground/80 data-[active=true]:text-foreground px-3 py-1.5 text-sm font-medium"
                            >
                              Users
                            </Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/admin/settings"
                              className="text-foreground/80 data-[active=true]:text-foreground px-3 py-1.5 text-sm font-medium"
                            >
                              Settings
                            </Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/"
                          className="text-foreground/80 data-[active=true]:text-foreground px-3 py-1.5 text-sm font-medium"
                        >
                          Home
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/features"
                          className="text-foreground/80 data-[active=true]:text-foreground px-3 py-1.5 text-sm font-medium"
                        >
                          Features
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/pricing"
                          className="text-foreground/80 data-[active=true]:text-foreground px-3 py-1.5 text-sm font-medium"
                        >
                          Pricing
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/contact"
                          className="text-foreground/80 data-[active=true]:text-foreground px-3 py-1.5 text-sm font-medium"
                        >
                          Contact
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <Button asChild variant="outline" size="sm" className="hidden xs:inline-flex">
                  <Link to={dashboardPath}>Open Dashboard</Link>
                </Button>
                <Button size="sm" variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/help">Help</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="hidden xs:inline-flex">
                  <Link to="/login">Create account</Link>
                </Button>
                <Button asChild size="sm" className="inline-flex gap-2">
                  <Link to="/login" className="flex items-center gap-2">
                    <UserRound className="size-4" />
                    <span>Sign in</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
