export type TransportMode =
  | 'car_petrol' | 'car_diesel' | 'car_ev' | 'two_wheeler' | 'bus' | 'metro_rail';
export type DietType = 'vegan' | 'vegetarian' | 'mixed' | 'meat_heavy';
export type Category = 'electricity' | 'transport' | 'food' | 'other';

export interface FootprintInput {
  period: 'monthly';
  region: string;
  electricity_kwh: number;
  trips: { mode: TransportMode; distance_km: number }[];
  flight_km_short_haul: number;
  flight_km_long_haul: number;
  diet_type: DietType;
  other_spend_usd: number;
}

export interface LineItem {
  category: Category;
  activity_type: string;
  quantity: number;
  unit: string;
  factor_value: number;
  factor_unit: string;
  factor_region: string;
  source: string;
  kg_co2e: number;
}

export interface BenchmarkComparison {
  benchmark_id: string;
  label: string;
  annual_per_capita_tco2e: number;
  user_annualised_tco2e: number;
  ratio: number;
  source: string;
}

export interface CalculateResponse {
  period: string;
  unit: string;
  total: number;
  categories: Record<Category, number>;
  line_items: LineItem[];
  assumptions: string[];
  methodology_version: string;
  annualised_tco2e: number;
  comparisons: BenchmarkComparison[];
  report_id: number | null;
}

export interface Recommendation {
  id: string;
  category: Category;
  action_text: string;
  estimated_savings_kg_co2e_monthly: number;
  percent_of_total: number;
}