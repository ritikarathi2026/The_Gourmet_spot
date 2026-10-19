export interface MenuItem {
    id: number;
    name: string;
    price: number;
    ingredients: {
        ingredientId: number;
        quantity: number;
    }[];
}