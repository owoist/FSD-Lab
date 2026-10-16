import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CalculateResponse } from '../api/types';

export function CategoryChart({ result }: { result: CalculateResponse }) {
  const data = Object.entries(result.categories).map(([name, kg]) => ({ name, kg }));
  return (
    <div className="card">
      <h2>Where it comes from</h2>
      <p className="big">{result.total.toFixed(1)} <small>kg CO₂e / month</small></p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis unit=" kg" />
          <Tooltip formatter={(v: number) => `${v.toFixed(1)} kg CO₂e`} />
          <Bar dataKey="kg" fill="#2f855a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}