// Emission factors (kg CO2e). Approximate; cite sources in your report.
const T = { car: 0.17, bike: 0.1, bus: 0.09, rail: 0.04, flight: 0.15 }; // per km
const D = { vegan: 125, vegetarian: 140, pescatarian: 160, mixed: 210, meat_heavy: 275 }; // per month
const r = (x) => Math.round(x * 10) / 10;
const n = (v) => Math.max(0, +v || 0);

export function calculate({
  kwh,
  gridFactor = 0.71,
  km = {},
  diet = "mixed",
  lpgKg,
  wasteKg,
} = {}) {
  kwh = n(kwh);
  lpgKg = n(lpgKg);
  wasteKg = n(wasteKg);
  gridFactor = n(gridFactor) || 0.71;
  if (!(diet in D)) diet = "mixed";
  const k = Object.fromEntries(Object.keys(T).map((m) => [m, n(km[m])]));
  const breakdown = {
    electricity: kwh * gridFactor,
    transport: Object.keys(T).reduce((s, m) => s + T[m] * k[m], 0),
    food: D[diet],
    household: lpgKg * 3 + wasteKg * 0.5,
  };
  const recs = [
    ["Shift half your car travel to bus/rail", k.car * 0.5 * (T.car - T.bus)],
    ["Replace one in three flight km with rail or video calls", (k.flight / 3) * T.flight],
    ["Cut electricity use 20% (LEDs, efficient AC, star-rated appliances)", kwh * 0.2 * gridFactor],
    ["Go meat-free 3 days a week", ((D[diet] - D.vegetarian) * 3) / 7],
    ["Segregate waste and compost food scraps", wasteKg * 0.25],
    ["Cook efficiently (pressure cooker, induction)", lpgKg * 3 * 0.15],
  ]
    .map(([action, s]) => ({ action, savingKgPerMonth: r(s) }))
    .filter((x) => x.savingKgPerMonth > 0)
    .sort((a, b) => b.savingKgPerMonth - a.savingKgPerMonth)
    .slice(0, 5);
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  for (const key in breakdown) breakdown[key] = r(breakdown[key]);
  return { totalKgCO2e: r(total), breakdown, recommendations: recs };
}

// Per-capita benchmarks. NOTE: OWID/GCP figures are fossil CO2 only, not full CO2e. Verify before submitting.
export const benchmarks = {
  note: "Lifestyle footprint and investment-associated emissions are different concepts; do not compare them directly.",
  perCapita: [
    {
      region: "India",
      monthlyKgCO2: 170,
      annualTonnes: 2.0,
      year: 2023,
      source: "Our World in Data / Global Carbon Project",
    },
    {
      region: "World",
      monthlyKgCO2: 390,
      annualTonnes: 4.7,
      year: 2023,
      source: "Our World in Data / Global Carbon Project",
    },
    {
      region: "USA",
      monthlyKgCO2: 1240,
      annualTonnes: 14.9,
      year: 2023,
      source: "Our World in Data / Global Carbon Project",
    },
  ],
  scenarios: [
    {
      type: "illustrative",
      label: "Private jet, 100 flight-hours/year (assumes ~2 tCO2/hr)",
      annualTonnes: 200,
      source: "Assumption; varies widely by aircraft",
    },
  ],
  investmentAssociated: [
    {
      label: "Average billionaire investment emissions (sample of 125)",
      annualTonnes: 3100000,
      year: 2022,
      source: "Oxfam, 'Carbon Billionaires'",
    },
  ],
};
