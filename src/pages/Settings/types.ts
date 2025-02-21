
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

export interface Staff {
  id: string;
  name: string;
}

export interface Calculation {
  rateType: string;
  rateName: string;
  rate: number;
  quantity: number;
  subtotal: number;
  gst: number;
  total: number;
}
