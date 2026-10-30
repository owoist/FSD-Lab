"use client";

import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  CircleGauge,
  Cloud,
  Footprints,
  Globe2,
  Leaf,
  Lightbulb,
  MapPin,
  Recycle,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const FEATURES = [
  {
    icon: CircleGauge,
    title: "Your personal footprint",
    description:
      "Turn everyday electricity, travel, food and household habits into a clear monthly CO₂e estimate.",
    detail: "Understand your baseline",
  },
  {
    icon: BarChart3,
    title: "Insights that make sense",
    description:
      "Explore category breakdowns, monthly trends and the habits contributing most to your emissions.",
    detail: "Find your biggest impact",
  },
  {
    icon: Globe2,
    title: "Transparent benchmarks",
    description:
      "Compare your footprint with India, global and US benchmarks with sources, units and reference years.",
    detail: "Compare with confidence",
  },
  {
    icon: Lightbulb,
    title: "A practical reduction plan",
    description:
      "Discover achievable changes ranked by their estimated emissions savings and real-world practicality.",
    detail: "Turn insight into action",
  },
];

const STEPS = [
  {
    number: "01",
    icon: Footprints,
    title: "Tell us about your lifestyle",
    description: "Enter your electricity use, commute, food habits and other everyday activities.",
  },
  {
    number: "02",
    icon: BarChart3,
    title: "Discover your impact",
    description:
      "Get an estimated monthly footprint, understand the biggest contributors and explore the numbers.",
  },
  {
    number: "03",
    icon: TrendingDown,
    title: "Make changes that count",
    description:
      "Build a realistic action plan, track your progress and see how your choices add up.",
  },
];

const CATEGORIES = [
  { name: "Transport", value: 38, amount: "0.76 t", icon: MapPin },
  { name: "Electricity", value: 28, amount: "0.56 t", icon: Zap },
  { name: "Food", value: 21, amount: "0.42 t", icon: Leaf },
  { name: "Household", value: 13, amount: "0.26 t", icon: Cloud },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Transparent by design",
    description:
      "Understand the emission factors, assumptions, units and reference years behind your estimates.",
  },
  {
    icon: Globe2,
    title: "Grounded in context",
    description:
      "Explore relevant comparisons instead of treating every country and lifestyle as the same.",
  },
  {
    icon: Sparkles,
    title: "Progress over perfection",
    description:
      "Focus on achievable improvements, measurable progress and the changes that suit your life.",
  },
];

export default function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(5,150,105,0.16),transparent_55%)]" />

      <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-32">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2 text-xs font-medium text-emerald-500">
            <Sparkles className="size-3.5" />
            A clearer picture of your carbon footprint
          </div>

          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Know your impact.
            <span className="mt-2 block text-emerald-500">Change what comes next.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Your everyday choices leave a footprint. Ecometrics helps you understand it, discover
            where your emissions come from and find practical ways to make a difference.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className={buttonVariants({ size: "lg" })}>
              Calculate my footprint
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="#how-it-works"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              See how it works
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Easy to understand
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Transparent estimates
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-8 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative rounded-3xl border border-border/80 bg-card/90 p-5 shadow-2xl shadow-emerald-950/10 backdrop-blur sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CircleGauge className="size-4 text-emerald-500" />
                  Footprint overview
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">Your monthly impact</h2>
              </div>
              <span className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground">
                Example
              </span>
            </div>

            <div className="mt-8 rounded-2xl border border-emerald-500/15 bg-emerald-500/6 p-5">
              <p className="text-sm text-muted-foreground">Estimated monthly emissions</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-tight">2.00</span>
                <span className="pb-1.5 text-sm text-muted-foreground">tonnes CO₂e</span>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <BarChart3 className="size-4 text-emerald-500" />
                Illustrative data across four lifestyle categories
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Where it comes from</h3>
                <span className="text-xs text-muted-foreground">Category breakdown</span>
              </div>

              <div className="space-y-5">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;

                  return (
                    <div key={category.name}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2.5 text-sm">
                          <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
                            <Icon className="size-4 text-emerald-500" />
                          </span>
                          {category.name}
                        </span>
                        <span className="text-sm font-medium tabular-nums">{category.amount}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${category.value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Preview uses illustrative values, not a real user's measurements.
          </p>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-9 sm:grid-cols-3 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
              <Zap className="size-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-medium">Everyday activities</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Electricity, travel, food and more
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
              <Globe2 className="size-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-medium">Meaningful comparisons</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Context with documented benchmarks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
              <TrendingDown className="size-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-medium">Actionable next steps</h3>
              <p className="mt-1 text-sm text-muted-foreground">Focus on realistic improvements</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-500">
            Everything in one place
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Understand the numbers.
            <span className="block text-muted-foreground">Make them meaningful.</span>
          </h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            No confusing spreadsheets or disconnected statistics. Just a practical way to understand
            your impact and decide what to do next.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-border/80 bg-card/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-card"
              >
                <div className="flex size-12 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/10 text-emerald-500 transition group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-medium text-emerald-500">
                  <Check className="size-3.5" />
                  {feature.detail}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-500">
              Simple by design
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Three steps toward a lighter footprint.
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              Start with what you know. Get a clearer picture. Use it to make more informed
              decisions, one change at a time.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="relative rounded-2xl border border-border bg-background p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-widest text-emerald-500">
                      {step.number}
                    </span>
                    <Icon className="size-5 text-emerald-500" />
                  </div>
                  <h3 className="mt-8 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
                  {index < STEPS.length - 1 && (
                    <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden size-7 -translate-y-1/2 rounded-full border border-border bg-background p-1.5 text-muted-foreground md:block" />
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="methodology"
        className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28"
      >
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-500">
              Built on transparency
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Sustainability deserves more than guesswork.
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              A useful carbon estimate should explain its assumptions, not hide behind a number.
              Ecometrics is designed to make emission calculations understandable, comparisons fair
              and recommended actions practical.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((principle, index) => {
              const Icon = principle.icon;

              return (
                <article
                  key={principle.title}
                  className={`rounded-2xl border border-border bg-card/60 p-6 ${
                    index === 0 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 font-semibold">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {principle.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-500/6 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.10),transparent_65%)]" />
          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-background text-emerald-500">
              <Recycle className="size-7" />
            </div>
            <h2 className="mt-7 text-3xl font-semibold tracking-tight sm:text-5xl">
              Small changes start with
              <span className="block text-emerald-500">better awareness.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">
              Your first step doesn't have to be perfect. Start understanding your footprint today
              and discover where meaningful change is possible.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Estimates are for awareness and personal decision-making, not formal carbon
              accounting.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Leaf className="size-4" />
            </span>
            <span className="font-semibold">Ecometrics</span>
          </Link>

          <p className="max-w-md text-xs leading-5 text-muted-foreground">
            Emissions are estimates based on the available activity data and emission factors.
            Actual impacts vary by location, methodology and individual circumstances.
          </p>
        </div>
        <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
          Built for a more informed, sustainable future.
        </div>
      </footer>
    </main>
  );
}
