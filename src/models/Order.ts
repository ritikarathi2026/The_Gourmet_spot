export interface OrderItem {
    menuItemId: number;
    quantity: number;
}

export interface Order {
    id: number;
    items: OrderItem[];
    total: number;
}