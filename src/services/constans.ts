import {v4 as uuidv4} from "uuid";
import {Recipe} from "../types/beans";

export function defaultRecipes(): Recipe[] {
    return [
        {
            id: uuidv4(),
            method: "V60",
            grindSize: "EK43 - 8.5",
            waterTemp: 96,
            doseIn: 18,
            doseOut: 300,
            timeTotal: "3:00",
            steps: ["0:00 - Bloom 60g", "0:45 - Pour to 300g"]
        },
        {
            id: uuidv4(),
            method: "Espresso",
            grindSize: "Mythos - 3.8",
            waterTemp: 93,
            doseIn: 18,
            doseOut: 36,
            timeTotal: "28s",
            steps: []
        }
    ]
}