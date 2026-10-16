import { useState } from 'react';
import './App.css';
import { calculate, getRecommendations } from './api/client';
import type { CalculateResponse, Recommendation } from './api/types';
import { BenchmarkChart } from './components/BenchmarkChart';
import { CategoryChart } from './components/CategoryChart';
import { FootprintForm } from './components/FootprintForm';
import { Recommendations } from './components/Recommendations';
import { DEFAULT_FORM, toPayload, type FormState } from './lib/payload';

export default function App() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [result, setResult] = useState<CalculateResponse | null>(null);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(save: boolean) {
    setLoading(true);
    setError(null);
    try {
      const payload = toPayload(form);
      const [r, rec] = await Promise.all([calculate(payload, save), getRecommendations(payload)]);
      setResult(r);
      setRecs(rec);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header>
        <h1>Carbon Footprint Calculator</h1>
        <p className="muted">Estimate your monthly emissions and see what to change first.</p>
      </header>

      <div className="layout">
        <FootprintForm value={form} onChange={setForm} onSubmit={run} loading={loading} />

        <div className="results">
          {error && <div className="card error" role="alert">{error}</div>}
          {!result && !error && <div className="card muted">Fill in your month and press Calculate.</div>}
          {result && (
            <>
              <CategoryChart result={result} />
              <BenchmarkChart result={result} />
              <Recommendations items={recs} />
              <details className="card">
                <summary>Assumptions &amp; methodology v{result.methodology_version}</summary>
                <ul>{result.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
                {result.report_id && <p>Saved as report #{result.report_id}</p>}
              </details>
            </>
          )}
        </div>
      </div>
    </main>
  );
}