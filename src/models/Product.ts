export interface IVariant {
  id: string;
  name: string;
  color?: string;
  storage?: string;
  price: number;
  mrp: number;
  image: string;
  images?: string[];
  stock?: number;
}

export interface IEMIPlan {
  id: string;
  tenure: number;
  monthlyPayment: number;
  interestRate: number;
  cashback?: number;
  mutualFundName?: string;
}

export interface ISpecification {
  key: string;
  value: string;
}

export interface IDownpaymentOption {
  id: string;
  amount: number;
  label: string;
}

export interface IProduct {
  id?: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  variants: IVariant[];
  emi_plans: IEMIPlan[];
  specifications?: ISpecification[];
  downpayment_options?: IDownpaymentOption[];
  created_at?: string;
  updated_at?: string;
}
