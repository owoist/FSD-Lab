export default function Bars({ rows, max }: { rows: [string, number][]; max: number }) {
  return (
    <div className="space-y-1.5">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center gap-2 text-sm">
          <span className="w-28 shrink-0 capitalize">{k}</span>
          <div className="h-3 flex-1 rounded bg-muted">
            <div
              className="h-3 rounded bg-primary"
              style={{ width: `${Math.min(100, (v / (max || 1)) * 100)}%` }}
            />
          </div>
          <span className="w-14 text-right tabular-nums">{v}</span>
        </div>
      ))}
    </div>
  );
}
