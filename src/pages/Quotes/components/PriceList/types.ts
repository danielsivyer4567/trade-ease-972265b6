
export interface PriceListItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NewPriceItemFormData {
  name: string;
  category: string;
  price: number;
  description: string;
}
