import { InventoryService } from "./services/InventoryServices";
import { OrderService } from "./services/OrderService";
import * as readline from "readline";

const inventoryService = new InventoryService();
const orderService = new OrderService(inventoryService);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu(): void {

    console.log("\n===== THE GOURMET SPOT =====");
    console.log("1. Show Inventory");
    console.log("2. Show Menu");
    console.log("3. Add Stock");
    console.log("4. Place Order");
    console.log("5. Exit");

    rl.question("\nEnter your choice: ", handleChoice);
}

function handleChoice(choice: string): void {

    try {

        switch (choice) {

            case "1":
                inventoryService.showInventory();
                showMenu();
                break;

            case "2":
                showRestaurantMenu();
                showMenu();
                break;

            case "3":
                addStock();
                break;

            case "4":
                placeOrder();
                break;

            case "5":
                console.log("Thank you for visiting The Gourmet Spot!");
                rl.close();
                break;

            default:
                console.log("Invalid choice. Please try again.");
                showMenu();
        }

    } catch (error) {

        if (error instanceof Error) {
            console.log("Error:", error.message);
        }

        showMenu();
    }
}

function showRestaurantMenu(): void {

    console.log("\n----- RESTAURANT MENU -----");

    const menu = orderService.getMenu();

    menu.forEach(item => {
        console.log(
            `${item.id}. ${item.name} - ₹${item.price}`
        );
    });
}

function addStock(): void {

    const inventory = inventoryService.getInventory();

    console.log("\n---------- ADD STOCK -------------");

    inventory.forEach(item => {
        console.log(`${item.id}. ${item.name}`);
    });

    rl.question("\nEnter ingredient name: ", (name) => {

        const ingredient = inventory.find(
            item => item.name.toLowerCase() === name.toLowerCase()
        );

        if (!ingredient) {
            console.log("Ingredient not found.");
            showMenu();
            return;
        }

        rl.question("Enter quantity to add: ", (quantityInput) => {

            const quantity = Number(quantityInput);

            inventoryService.addStock(
                ingredient.id,
                quantity
            );

            showMenu();
        });
    });
}

function placeOrder(): void {

    showRestaurantMenu();

    rl.question("\nEnter menu item ID: ", (idInput) => {

        rl.question("Enter quantity: ", (quantityInput) => {

            const menuItemId = Number(idInput);
            const quantity = Number(quantityInput);

            const order = [
                {
                    menuItemId: menuItemId,
                    quantity: quantity
                }
            ];

            try {

                orderService.createOrder(order);

            } catch (error) {

                if (error instanceof Error) {
                    console.log("Error:", error.message);
                }
            }

            showMenu();
        });
    });
}

showMenu();