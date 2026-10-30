"use client";

import {
  ArrowRight,
  ChevronDown,
  History,
  House,
  Leaf,
  LogIn,
  LogOut,
  Menu,
  Calculator,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const NAV_ENTRIES = {
  home: {
    label: "Home",
    href: "/",
    icon: House,
  },
  calculator: {
    label: "Calculator",
    href: "/dashboard/calculator",
    icon: Calculator,
  },
  dashboard: {
    label: "Dashboard",
    href: "/dashboard",
    icon: House,
  },
  history: {
    label: "History",
    href: "/dashboard",
    icon: History,
  },
  features: {
    label: "Features",
    href: "/#features",
    icon: Sparkles,
  },
  "how-it-works": {
    label: "How it works",
    href: "/#how-it-works",
    icon: Workflow,
  },
  methodology: {
    label: "Methodology",
    href: "/#methodology",
    icon: Leaf,
  },
} as const;

export type NavEntry = keyof typeof NAV_ENTRIES;

interface NavProps {
  items?: NavEntry[];
  showAuth?: boolean;
}

export default function Nav({ items = ["calculator", "history"], showAuth = true }: NavProps) {
  const { data: session, isPending } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const user = session?.user;
  const avatarSeed = encodeURIComponent(user?.email || user?.name || "ecometrics-guest");

  const avatarUrl = `https://api.dicebear.com/10.x/lorelei/svg?seed=${avatarSeed}&backgroundColor=d1fae5`;

  const visibleItems = items.map((key) => ({
    key,
    ...NAV_ENTRIES[key],
  }));

  async function handleSignOut() {
    await authClient.signOut();
    window.location.assign("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Ecometrics home">
          <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
            <Leaf className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Ecometrics</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {visibleItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "text-muted-foreground hover:text-foreground",
              })}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {showAuth && !isPending && !user && (
            <>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                <LogIn className="mr-1.5 size-4" />
                Log in
              </Link>

              <Link
                href="/login?mode=signup"
                className={buttonVariants({
                  size: "sm",
                  className: "hidden sm:inline-flex",
                })}
              >
                Get started
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </>
          )}

          {showAuth && !isPending && user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                aria-expanded={accountOpen}
                aria-label="Account menu"
                className="flex items-center gap-2 rounded-full border border-border/70 p-1 pr-2.5 transition hover:bg-muted"
              >
                <img src={avatarUrl} alt="" className="size-8 rounded-full bg-emerald-100" />
                <span className="hidden max-w-36 truncate text-sm sm:block">{user.name}</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-popover p-2 shadow-xl">
                  <div className="flex items-center gap-3 px-3 py-3">
                    <img src={avatarUrl} alt="" className="size-10 rounded-full bg-emerald-100" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{user.name || "Your account"}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="my-1 border-t border-border" />

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </Button>
                </div>
              )}
            </div>
          )}

          {showAuth && isPending && <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />}

          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-background/95 px-5 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}

            {showAuth && user && (
              <>
                <div className="my-2 border-t border-border" />
                <p className="truncate px-3 py-1 text-xs text-muted-foreground">
                  Signed in as {user.email}
                </p>
                <Button variant="ghost" size="sm" className="justify-start" onClick={handleSignOut}>
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </Button>
              </>
            )}

            {showAuth && !isPending && !user && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className={buttonVariants({
                  variant: "outline",
                  className: "mt-2",
                })}
              >
                <LogIn className="mr-2 size-4" />
                Log in or sign up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
