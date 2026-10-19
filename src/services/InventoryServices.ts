import { Ingredient } from "../models/Ingredient";
import { FileManager } from "../utils/FileManager";

export class InventoryService {

    private filePath = "./src/data/inventory.json";

    getInventory(): Ingredient[] {

        const data = FileManager.readFile(this.filePath);

        return JSON.parse(data);
    }

    addStock(id: number, quantity: number): void {

        const inventory = this.getInventory();

        const ingredient = inventory.find(item => item.id === id);

        if (!ingredient) {
            throw new Error("Ingredient not found");
        }

        ingredient.quantity += quantity;

        FileManager.writeFile(
            this.filePath,
            JSON.stringify(inventory, null, 2)
        );

        console.log("Stock added successfully.");
    }

    useStock(id: number, quantity: number): void {

        const inventory = this.getInventory();

        const ingredient = inventory.find(item => item.id === id);

        if (!ingredient) {
            throw new Error("Ingredient not found");
        }

        if (ingredient.quantity < quantity) {
            throw new Error(
                `Not enough ${ingredient.name} available`
            );
        }

        ingredient.quantity -= quantity;

        FileManager.writeFile(
            this.filePath,
            JSON.stringify(inventory, null, 2)
        );
    }

    showInventory(): void {

        const inventory = this.getInventory();

        console.log("\n----- INVENTORY -----");

        inventory.forEach(item => {
            console.log(
                `${item.id}. ${item.name} - ${item.quantity} ${item.unit}`
            );
        });
    }
}