
export interface Staff {
  id: string;
  name: string;
}

export interface Rate {
  id: string;
  name: string;
  rate: number;
  unit: string;
}

export interface CommissionRate {
  id: string;
  staffName: string;
  percentage: number;
  minimumSale: number;
}

export interface Calculation {
  quantity: number;
  rate: number;
  total: number;
}

export interface Job {
  id: string;
  job_number: string;
  title: string;
  measurements: {
    squareMeters?: number;
    linealMeters?: number;
    items?: number;
    hours?: number;
  };
}

export interface SearchResult {
  job: Job;
  matchingRate?: Rate;
}
