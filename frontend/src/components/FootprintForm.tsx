import type { DietType, TransportMode } from '../api/types';
import type { FormState } from '../lib/payload';

const MODES: { value: TransportMode; label: string }[] = [
  { value: 'car_petrol', label: 'Car (petrol)' },
  { value: 'car_diesel', label: 'Car (diesel)' },
  { value: 'car_ev', label: 'Car (electric)' },
  { value: 'two_wheeler', label: 'Two-wheeler' },
  { value: 'bus', label: 'Bus' },
  { value: 'metro_rail', label: 'Metro / rail' },
];
const DIETS: DietType[] = ['vegan', 'vegetarian', 'mixed', 'meat_heavy'];

interface Props {
  value: FormState;
  onChange: (next: FormState) => void;
  onSubmit: (save: boolean) => void;
  loading: boolean;
}

export function FootprintForm({ value, onChange, onSubmit, loading }: Props) {
  const set = <K extends keyof FormState>(key: K, v: FormState[K]) =>
    onChange({ ...value, [key]: v });

  const setTrip = (i: number, patch: Partial<FormState['trips'][number]>) =>
    set('trips', value.trips.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));

  return (
    <div className="card form">
      <h2>Your month</h2>

      <label>Region
        <input value={value.region} onChange={(e) => set('region', e.target.value)} />
      </label>

      <label>Electricity (kWh)
        <input type="number" min="0" value={value.electricityKwh}
               onChange={(e) => set('electricityKwh', e.target.value)} />
      </label>

      <fieldset>
        <legend>Transport (km per month)</legend>
        {value.trips.map((t, i) => (
          <div className="row" key={i}>
            <select value={t.mode} onChange={(e) => setTrip(i, { mode: e.target.value as TransportMode })}>
              {MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <input type="number" min="0" value={t.km} onChange={(e) => setTrip(i, { km: e.target.value })} />
            <button type="button" onClick={() => set('trips', value.trips.filter((_, idx) => idx !== i))}
                    aria-label="Remove trip">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => set('trips', [...value.trips, { mode: 'bus', km: '0' }])}>
          + Add mode
        </button>
      </fieldset>

      <label>Flights, short-haul (km)
        <input type="number" min="0" value={value.flightShortKm}
               onChange={(e) => set('flightShortKm', e.target.value)} />
      </label>
      <label>Flights, long-haul (km)
        <input type="number" min="0" value={value.flightLongKm}
               onChange={(e) => set('flightLongKm', e.target.value)} />
      </label>

      <label>Diet
        <select value={value.diet} onChange={(e) => set('diet', e.target.value as DietType)}>
          {DIETS.map((d) => <option key={d} value={d}>{d.replace('_', ' ')}</option>)}
        </select>
      </label>

      <label>Other spending (USD / month)
        <input type="number" min="0" value={value.spendUsd}
               onChange={(e) => set('spendUsd', e.target.value)} />
      </label>

      <div className="row">
        <button type="button" disabled={loading} onClick={() => onSubmit(false)}>
          {loading ? 'Calculating…' : 'Calculate'}
        </button>
        <button type="button" disabled={loading} onClick={() => onSubmit(true)}>
          Calculate &amp; save
        </button>
      </div>
    </div>
  );
}