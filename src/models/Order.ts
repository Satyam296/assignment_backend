export interface IOrder {
  id?: string;
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_color?: string;
  variant_storage?: string;
  variant_price: number;
  emi_plan_id: string;
  emi_tenure: number;
  monthly_payment: number;
  interest_rate: number;
  cashback?: number;
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}
