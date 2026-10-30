"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Download,
  Leaf,
  LoaderCircle,
  Plus,
  RefreshCw,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import Bars from "@/components/bars";
import Gate from "@/components/gate";
import { Button, buttonVariants } from "@/components/ui/button";
import { api } from "@/lib/api";

type Recommendation = {
  action: string;
  savingKgPerMonth?: number;
};

type Footprint = {
  _id: string;
  month: string;
  result: {
    totalKgCO2e: number;
    breakdown?: Record<string, number>;
    recommendations?: Recommendation[];
  };
};

const numberFormat = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 1,
});

function formatKg(value: number) {
  return `${numberFormat.format(value)} kg`;
}

function formatMonth(value: string) {
  const date = new Date(`${value}-01T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Activity;
}) {
  return (
    <article className="rounded-2xl border border-border/70 bg-card p-5 transition hover:border-emerald-500/30">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
    </article>
  );
}

export default function Page() {
  return (
    <Gate>
      <History />
    </Gate>
  );
}

function History() {
  const [rows, setRows] = useState<Footprint[] | null>(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setError("");

    try {
      const data = await api("/api/footprints");
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your footprints.");
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const sortedRows = useMemo(
    () => [...(rows ?? [])].sort((a, b) => b.month.localeCompare(a.month)),
    [rows],
  );

  const latest = sortedRows[0];
  const previous = sortedRows[1];

  const average = useMemo(() => {
    if (!rows?.length) return 0;

    return rows.reduce((sum, row) => sum + row.result.totalKgCO2e, 0) / rows.length;
  }, [rows]);

  const change = useMemo(() => {
    if (!latest || !previous || previous.result.totalKgCO2e === 0) {
      return null;
    }

    return (
      ((latest.result.totalKgCO2e - previous.result.totalKgCO2e) / previous.result.totalKgCO2e) *
      100
    );
  }, [latest, previous]);

  const categoryRows = useMemo(() => {
    const breakdown = latest?.result.breakdown;

    if (!breakdown) return [];

    return Object.entries(breakdown)
      .filter(([, value]) => typeof value === "number")
      .sort((a, b) => b[1] - a[1]);
  }, [latest]);

  const totalSavedMonths = new Set(rows?.map((row) => row.month)).size;

  async function deleteFootprint(id: string) {
    if (!window.confirm("Delete this saved footprint? This cannot be undone.")) {
      return;
    }

    setDeleting(id);

    try {
      await api(`/api/footprints/${id}`, undefined, "DELETE");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete this footprint.");
    } finally {
      setDeleting(null);
    }
  }

  function exportCsv() {
    if (!rows?.length) return;

    setExporting(true);

    try {
      const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

      const header = ["Month", "Total kg CO2e", "Category", "Category kg CO2e"];

      const records = rows.flatMap((row) => {
        const categories = Object.entries(row.result.breakdown ?? {});

        if (!categories.length) {
          return [[row.month, row.result.totalKgCO2e, "", ""]];
        }

        return categories.map(([category, value]) => [
          row.month,
          row.result.totalKgCO2e,
          category,
          value,
        ]);
      });

      const csv = [header, ...records]
        .map((record) => record.map(escapeCsv).join(","))
        .join("\r\n");

      const blob = new Blob(["\uFEFF", csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = "ecometrics-footprints.csv";
      anchor.click();

      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  const firstRecommendation = latest?.result.recommendations?.[0];

  return (
    <main className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(5,150,105,0.10),transparent_55%)]" />

      <div className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-8 sm:py-12">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-500">
              <Activity className="size-4" />
              YOUR SUSTAINABILITY OVERVIEW
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your dashboard</h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Understand your footprint, follow your progress, and discover practical opportunities
              to reduce your environmental impact.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void load()} disabled={rows === null}>
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </Button>

            <Link href="/dashboard/calculator" className={buttonVariants()}>
              <Plus className="mr-2 size-4" />
              New assessment
            </Link>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500"
          >
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              Try again
            </Button>
          </div>
        )}

        {rows === null ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-border bg-card">
            <LoaderCircle className="size-6 animate-spin text-emerald-500" />
            <span className="ml-3 text-sm text-muted-foreground">
              Loading your sustainability data...
            </span>
          </div>
        ) : rows.length === 0 ? (
          <section className="rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-12">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Leaf className="size-8" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold">Your sustainability journey starts here</h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              Complete your first footprint assessment to see your emissions breakdown, compare
              benchmarks, and start building a history of your monthly impact.
            </p>

            <Link href="/dashboard/calculator" className={`${buttonVariants()} mt-7`}>
              Calculate my footprint
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </section>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Latest monthly footprint"
                value={formatKg(latest!.result.totalKgCO2e)}
                detail={formatMonth(latest!.month)}
                icon={Leaf}
              />

              <MetricCard
                label="Historical average"
                value={formatKg(average)}
                detail={`Across ${rows.length} saved assessment${rows.length === 1 ? "" : "s"}`}
                icon={BarChart3}
              />

              <MetricCard
                label="Months tracked"
                value={String(totalSavedMonths)}
                detail="Distinct months with saved records"
                icon={CalendarDays}
              />

              <MetricCard
                label="Latest month vs. previous"
                value={
                  change === null
                    ? "Not available"
                    : `${change > 0 ? "+" : ""}${numberFormat.format(change)}%`
                }
                detail={
                  change === null
                    ? "Save another month to compare"
                    : change < 0
                      ? "Lower emissions than the previous saved assessment"
                      : change > 0
                        ? "Higher emissions than the previous saved assessment"
                        : "No change from the previous saved assessment"
                }
                icon={change !== null && change < 0 ? ArrowDownRight : TrendingUp}
              />
            </section>

            <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
              <article className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Your footprint over time</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Monthly totals from your saved assessments
                    </p>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    kg CO₂e
                  </span>
                </div>

                {sortedRows.length > 1 ? (
                  <div className="mt-7">
                    <Bars
                      rows={[...sortedRows]
                        .reverse()
                        .map((row) => [row.month, row.result.totalKgCO2e])}
                      max={Math.max(1, ...rows.map((row) => row.result.totalKgCO2e))}
                    />
                  </div>
                ) : (
                  <div className="mt-7 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border px-5 text-center">
                    <TrendingUp className="size-7 text-emerald-500" />
                    <p className="mt-3 text-sm font-medium">Your trend will appear here</p>
                    <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                      Save assessments for different months to see how your footprint changes over
                      time.
                    </p>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>{rows.length} saved record(s)</span>
                  <span>Sorted chronologically</span>
                </div>
              </article>

              <article className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Emissions breakdown</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Latest saved assessment</p>
                  </div>
                  <Wallet className="size-5 text-emerald-500" />
                </div>

                {categoryRows.length ? (
                  <div className="mt-6 space-y-5">
                    {categoryRows.map(([category, value]) => {
                      const total = latest!.result.totalKgCO2e;
                      const percentage = total > 0 ? Math.max(0, (value / total) * 100) : 0;

                      return (
                        <div key={category}>
                          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                            <span className="capitalize">{category}</span>
                            <span className="tabular-nums text-muted-foreground">
                              {formatKg(value)}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{
                                width: `${Math.min(100, percentage)}%`,
                              }}
                            />
                          </div>
                          <p className="mt-1.5 text-right text-xs text-muted-foreground">
                            {numberFormat.format(percentage)}%
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-6 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                    Category details are unavailable for this saved record. Your total footprint is
                    still available above.
                  </div>
                )}
              </article>
            </section>

            {firstRecommendation && (
              <section className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8">
                <div className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full bg-emerald-500/6 blur-2xl" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-500">
                      <Target className="size-4" />
                      YOUR NEXT OPPORTUNITY
                    </div>

                    <h2 className="mt-3 text-xl font-semibold">One practical step at a time</h2>

                    <p className="mt-2 leading-6 text-muted-foreground">
                      {firstRecommendation.action}
                    </p>

                    {firstRecommendation.savingKgPerMonth != null && (
                      <p className="mt-3 text-sm font-medium text-emerald-500">
                        Estimated potential reduction:{" "}
                        {formatKg(firstRecommendation.savingKgPerMonth)}/month
                      </p>
                    )}
                  </div>

                  <Link
                    href="/dashboard/calculator"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Review your footprint
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </div>
              </section>
            )}

            <section className="overflow-hidden rounded-2xl border border-border/70 bg-card">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5 sm:p-6">
                <div>
                  <h2 className="text-lg font-semibold">Saved assessments</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review, export, or remove previous monthly records.
                  </p>
                </div>

                <Button variant="outline" onClick={exportCsv} disabled={exporting || !rows.length}>
                  <Download className="mr-2 size-4" />
                  {exporting ? "Exporting..." : "Export CSV"}
                </Button>
              </div>

              <div className="divide-y divide-border">
                {sortedRows.map((row) => (
                  <div
                    key={row._id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        <CalendarDays className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium">{formatMonth(row.month)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {Object.keys(row.result.breakdown ?? {}).length} categories recorded
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <p className="font-semibold tabular-nums">
                          {formatKg(row.result.totalKgCO2e)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">kg CO₂e</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deleting === row._id}
                        onClick={() => void deleteFootprint(row._id)}
                      >
                        {deleting === row._id ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-4 text-xs text-muted-foreground sm:px-6">
                <span>{rows.length} saved record(s). Changes reflect your saved assessments.</span>
                <Link
                  href="/dashboard/calculator"
                  className="inline-flex items-center gap-1.5 font-medium text-emerald-500 hover:underline"
                >
                  Add another assessment
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </section>
          </>
        )}

        <footer className="flex flex-col gap-2 border-t border-border/60 pt-6 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Ecometrics · Your footprint, made understandable.</p>
          <p>Estimates are intended for awareness, not formal carbon accounting.</p>
        </footer>
      </div>
    </main>
  );
}
