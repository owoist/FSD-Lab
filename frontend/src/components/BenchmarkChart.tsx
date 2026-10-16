import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CalculateResponse } from '../api/types';

export function BenchmarkChart({ result }: { result: CalculateResponse }) {
  const data = [
    { name: 'You (annualised)', t: result.annualised_tco2e, you: true },
    ...result.comparisons.map((c) => ({ name: c.label, t: c.annual_per_capita_tco2e, you: false })),
  ];
  return (
    <div className="card">
      <h2>Compared with benchmarks</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" unit=" t" />
          <YAxis type="category" dataKey="name" width={150} />
          <Tooltip formatter={(v: number) => `${v.toFixed(2)} t CO₂e / year`} />
          <Bar dataKey="t">
            {data.map((d) => <Cell key={d.name} fill={d.you ? '#2f855a' : '#a0aec0'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="muted">
        Your figure is this month × 12, so it ignores seasonal variation.
        Benchmark sources: {result.comparisons.map((c) => c.source).join(' · ')}
      </p>
    </div>
  );
}