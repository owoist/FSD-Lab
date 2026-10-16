import type { CalculateResponse, FootprintInput, Recommendation } from './types';

const BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      // FastAPI: 422 detail is an array of {loc, msg}; others are a string
      if (Array.isArray(body.detail)) {
        message = body.detail.map((d: { loc: string[]; msg: string }) =>
          `${d.loc.slice(1).join('.')}: ${d.msg}`).join('; ');
      } else if (typeof body.detail === 'string') {
        message = body.detail;
      }
    } catch { /* keep default message */ }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const calculate = (input: FootprintInput, save = false) =>
  request<CalculateResponse>(`/calculate?save=${save}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });

export const getRecommendations = (input: FootprintInput) =>
  request<Recommendation[]>('/recommendations', {
    method: 'POST',
    body: JSON.stringify(input),
  });