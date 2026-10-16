import type { Recommendation } from '../api/types';

export function Recommendations({ items }: { items: Recommendation[] }) {
  return (
    <div className="card">
      <h2>Ways to cut back</h2>
      {items.length === 0 && <p className="muted">No significant savings found for this profile.</p>}
      <ul className="recs">
        {items.map((r) => (
          <li key={r.id}>
            <span>{r.action_text}</span>
            <strong>−{r.estimated_savings_kg_co2e_monthly.toFixed(1)} kg/mo ({r.percent_of_total}%)</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}