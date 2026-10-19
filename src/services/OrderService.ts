import { Order } from "../models/Order";
import { MenuItem } from "../models/MenuItem";
import { InventoryService } from "./InventoryServices";
import { FileManager } from "../utils/FileManager";

export class OrderService {

    private orderFile = "./src/data/orders.json";
    private menuFile = "./src/data/menu.json";

    private inventoryService: InventoryService;

    constructor(inventoryService: InventoryService) {
        this.inventoryService = inventoryService;
    }

    getMenu(): MenuItem[] {

        const data = FileManager.readFile(this.menuFile);

        return JSON.parse(data);
    }

    createOrder(
        orderItems: { menuItemId: number; quantity: number }[]
    ): void {

        const menu = this.getMenu();

        let subtotal = 0;

        for (const orderItem of orderItems) {

            const menuItem = menu.find(
                item => item.id === orderItem.menuItemId
            );

            if (!menuItem) {
                throw new Error("Menu item not found");
            }

            subtotal +=
                menuItem.price * orderItem.quantity;
        }

        const tax = subtotal * 0.05;

        const total = subtotal + tax;

        const orders: Order[] = JSON.parse(
            FileManager.readFile(this.orderFile)
        );

        const newOrder: Order = {
            id: orders.length + 1,
            items: orderItems,
            total: total
        };

        orders.push(newOrder);

        FileManager.writeFile(
            this.orderFile,
            JSON.stringify(orders, null, 2)
        );

        // Update inventory
        for (const orderItem of orderItems) {

            const menuItem = menu.find(
                item => item.id === orderItem.menuItemId
            );

            if (!menuItem) {
                continue;
            }

            for (const ingredient of menuItem.ingredients) {

                const requiredQuantity =
                    ingredient.quantity * orderItem.quantity;

                this.inventoryService.useStock(
                    ingredient.ingredientId,
                    requiredQuantity
                );
            }
        }

        console.log("\nOrder placed successfully.");

        console.log(`Subtotal: ₹${subtotal}`);
        console.log(`Tax: ₹${tax}`);
        console.log(`Total: ₹${total}`);
    }
}