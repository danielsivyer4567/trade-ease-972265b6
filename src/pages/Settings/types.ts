
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
