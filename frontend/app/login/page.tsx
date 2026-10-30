"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { inp } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function Login() {
  const router = useRouter();

  const [signup, setSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [v, setV] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState("");

  useEffect(() => {
    setSignup(new URLSearchParams(window.location.search).get("mode") === "signup");
  }, []);

  function switchMode(nextSignup: boolean) {
    setSignup(nextSignup);
    setErr("");

    const url = nextSignup ? "/login?mode=signup" : "/login";
    window.history.replaceState(null, "", url);
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const result = signup
        ? await authClient.signUp.email(v)
        : await authClient.signIn.email({
            email: v.email,
            password: v.password,
          });

      if (result.error) {
        setErr(result.error.message ?? "Something went wrong.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErr("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(5,150,105,0.12),transparent_55%)]" />

      <section className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-8 px-5 py-8 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
        {/* Left: branding and artwork */}
        <aside className="relative hidden min-h-[640px] overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#071b16] p-9 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_25%,rgba(16,185,129,0.24),transparent_50%),radial-gradient(ellipse_at_90%_80%,rgba(16,185,129,0.12),transparent_40%)]" />

          <div className="pointer-events-none absolute -right-28 top-24 size-96 rounded-full border border-emerald-400/10" />
          <div className="pointer-events-none absolute -right-12 top-40 size-64 rounded-full border border-emerald-400/15" />
          <div className="pointer-events-none absolute right-8 top-56 size-32 rounded-full border border-emerald-400/20" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-xs font-medium text-emerald-300">
              <Sparkles className="size-3.5" />
              Make every choice count
            </div>

            <h1 className="mt-8 max-w-md text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              A better future starts with
              <span className="block text-emerald-400">understanding today.</span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-emerald-50/65">
              Get a clearer picture of your carbon footprint, discover what drives it, and build
              habits that make a difference.
            </p>
          </div>

          {/* Decorative sustainability illustration */}
          <div className="relative z-10 my-8 flex flex-1 items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-[340px] items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-emerald-400/10" />
              <div className="absolute inset-7 rounded-full border border-dashed border-emerald-400/20" />
              <div className="absolute inset-16 rounded-full bg-emerald-400/[0.07] blur-xl" />

              <div className="relative flex size-36 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10 shadow-[0_0_100px_rgba(16,185,129,0.15)]">
                <div className="flex size-24 items-center justify-center rounded-full bg-emerald-400/10">
                  <Sprout className="size-14 text-emerald-300" strokeWidth={1.2} />
                </div>
              </div>

              <div className="absolute left-3 top-12 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 backdrop-blur">
                <Leaf className="size-5 text-emerald-300" />
              </div>

              <div className="absolute right-2 top-20 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 backdrop-blur">
                <CheckCircle2 className="size-5 text-emerald-300" />
              </div>

              <div className="absolute bottom-8 left-12 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 backdrop-blur">
                <ShieldCheck className="size-5 text-emerald-300" />
              </div>

              <div className="absolute bottom-4 right-8 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 backdrop-blur">
                <Sprout className="size-5 text-emerald-300" />
              </div>

              <div className="absolute right-0 top-0 rounded-xl border border-white/10 bg-[#102b22]/90 px-3 py-2 shadow-xl">
                <p className="text-[10px] text-emerald-100/60">Your next step</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium">
                  <Check className="size-3.5 text-emerald-400" />
                  Start with awareness
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                <Leaf className="size-5 text-emerald-300" />
              </div>

              <div>
                <p className="text-sm font-medium">Progress over perfection.</p>
                <p className="mt-1 text-xs leading-5 text-emerald-50/60">
                  Understand your impact, choose realistic changes, and measure your progress over
                  time.
                </p>
              </div>

              <ArrowUpRight className="ml-auto size-4 shrink-0 text-emerald-300" />
            </div>
          </div>
        </aside>

        {/* Right: authentication form */}
        <div className="mx-auto w-full max-w-md py-8 lg:py-0">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground lg:hidden"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
              {signup ? <Sprout className="size-6" /> : <Leaf className="size-6" />}
            </div>

            <p className="text-sm font-medium text-emerald-500">
              {signup ? "Start your journey" : "Welcome back"}
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              {signup ? "Create your account" : "Sign in to Ecometrics"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {signup
                ? "Create an account to understand your footprint and keep track of your progress."
                : "Pick up where you left off and continue tracking your environmental impact."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {signup && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full name
                </label>
                <input
                  id="name"
                  autoComplete="name"
                  className={inp}
                  placeholder="Your name"
                  required
                  value={v.name}
                  onChange={(e) =>
                    setV((current) => ({
                      ...current,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  autoComplete="email"
                  className={`${inp} pl-10`}
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={v.email}
                  onChange={(e) =>
                    setV((current) => ({
                      ...current,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <span className="text-xs text-muted-foreground">
                  {signup ? "At least 8 characters" : "Keep it secure"}
                </span>
              </div>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  autoComplete={signup ? "new-password" : "current-password"}
                  className={`${inp} pl-10`}
                  type="password"
                  placeholder="Enter your password"
                  required
                  minLength={8}
                  value={v.password}
                  onChange={(e) =>
                    setV((current) => ({
                      ...current,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {err && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500"
              >
                {err}
              </div>
            )}

            <Button className="h-11 w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  {signup ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                <>
                  {signup ? "Create account" : "Sign in"}
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-xs text-muted-foreground">
                  {signup ? "Already registered?" : "New to Ecometrics?"}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full"
              onClick={() => switchMode(!signup)}
              disabled={loading}
            >
              {signup ? "Sign in instead" : "Create an account"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">
            By continuing, you agree to use Ecometrics estimates as a guide for personal awareness,
            not as formal carbon accounting.
          </p>
        </div>
      </section>
    </main>
  );
}
