"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getUser, logout } from "@/lib/auth"

export default function Navbar() {
  const pathname = usePathname()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const u = getUser()
    setUserEmail(u?.email ?? null)
  }, [])

  const nav = [
    { href: "/", label: "Home" },
    { href: "/watch-party", label: "Watch Party" },
    { href: "/memes", label: "Memes" },
    { href: "/reviews", label: "Reviews" },
    { href: "/login", label: "Login" },
  ]

  return (
    <header className="border-b bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          StreamSync
        </Link>

        <ul className="hidden gap-3 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn("rounded px-3 py-2 text-sm hover:bg-muted", pathname === item.href && "bg-muted")}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {userEmail ? (
            <>
              <span className="hidden text-sm text-muted-foreground md:inline">{userEmail}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout()
                  window.location.href = "/"
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
