export interface IAdmin {
  id?: string;
  email: string;
  password: string;
  name: string;
  notification_enabled: boolean;
  low_stock_threshold: number;
  created_at?: string;
  updated_at?: string;
}
