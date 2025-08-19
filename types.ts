
export interface Drink {
  id: string;
  name: string;
  quantity: number;
  emoji: string;
  price: number;
}

export interface OrderItem {
  drinkId: string;
  name: string;
  quantity: number;
  pricePerItem: number;
}

export interface Guest {
  id: string;
  name: string;
  orders: OrderItem[];
  paidAt?: string;
}