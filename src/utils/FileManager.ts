import * as fs from "fs";

export class FileManager {

    static readFile(filePath: string): string {
        try {
            return fs.readFileSync(filePath, "utf-8");
        } catch (error) {
            throw new Error(`Unable to read file: ${filePath}`);
        }
    }

    static writeFile(filePath: string, data: string): void {
        try {
            fs.writeFileSync(filePath, data);
        } catch (error) {
            throw new Error(`Unable to write file: ${filePath}`);
        }
    }
}