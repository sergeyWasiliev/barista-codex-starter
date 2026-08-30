// =========================================================
// API CLIENT (MOCKED FOR FRONTEND TESTING)
// =========================================================

const API_BASE = 'http://localhost:3000/api';

// // MOCK DATA: Чтобы верстка работала без бэкенда
// const mockBeans = [
//     {
//         id: "1",
//         title: "Kayanza Natural",
//         country: "Burundi",
//         description: "Funky and wild. High intensity fruit notes often compared to red wine or cooked plums.",
//         imageUrl: "assets/flags/bi.svg", // Убедись, что картинка есть в папке
//         roasterComment: "We barely believe, but here`s natural Burundi not for all money in the world. Sweet, with tones of dried fruits and chocolate.",
//         details: {
//             process: "Natural",
//             region: "Kayanza",
//             variety: ["Red Bourbon"],
//             scaScore: 88.5
//         },
//         flavorProfile: {
//             notes: ["Plum", "Blueberry", "Red Wine"],
//             acidity: 6,
//             sweetness: 8,
//             bitterness: 3
//         },
//         recipes: [
//             {
//                 method: "V60",
//                 grindSize: "EK43 - 8.5",
//                 waterTemp: 96,
//                 doseIn: 18,
//                 doseOut: 300,
//                 timeTotal: "3:00",
//                 steps: ["0:00 - Bloom 60g", "0:45 - Pour to 300g"]
//             },
//             {
//                 method: "Espresso",
//                 grindSize: "Mythos - 3.8",
//                 waterTemp: 93,
//                 doseIn: 18,
//                 doseOut: 36,
//                 timeTotal: "28s",
//                 steps: []
//             }
//         ]
//     },
//     {
//         id: "2",
//         title: "Cerrado Mineiro",
//         country: "Brazil",
//         description: "Sweet, full-bodied coffee with low acidity. Perfect for milk drinks.",
//         imageUrl: "assets/flags/br.svg",
//         roasterComment: "A classic daily cup. Nutty and chocolatey.",
//         details: {
//             process: "Natural",
//             region: "Minas Gerais",
//             variety: ["Mundo Novo"],
//             scaScore: 82.5
//         },
//         flavorProfile: {
//             notes: ["Hazelnut", "Chocolate", "Caramel"],
//             acidity: 3,
//             sweetness: 8,
//             bitterness: 4
//         },
//         recipes: [
//             { method: "V60", grindSize: "9", waterTemp: 92, doseIn: 20, doseOut: 300, timeTotal: "3:00", steps: [] },
//             { method: "Espresso", grindSize: "4.2", waterTemp: 93, doseIn: 18, doseOut: 36, timeTotal: "28s", steps: [] }
//         ]
//     }
// ];

export const apiClient = {
    // 1. GET LIST
    async getAllBeans() {
        const res = await fetch(`${API_BASE}/beans`);
        return await res.json();
    },

    // 2. GET DETAILS
    async getBeanById(id) {
        const res = await fetch(`${API_BASE}/beans/${id}`);
        return await res.json();
    },

    // // 3. CREATE
    // async createBean(beanData) {
    //     console.log('API: Creating bean...', beanData);
    //     mockBeans.push({ ...beanData, id: String(Date.now()), recipes: [] });
    // },
    //
    // // 4. UPDATE
    // async updateBean(id, beanData) {
    //     console.log(`API: Updating bean ${id}...`, beanData);
    //     // Mock update logic needed for full test, but console log is enough for now
    // },
    //
    // 5. DELETE
    async deleteBean(id) {
        const res = await fetch(`${API_BASE}/beans/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Failed to delete bean: ${id}`);
    },
    //
    // // 6. LOCALIZATION
    // async getTranslations(lang) {
    //     // Возвращаем пустой объект, пока нет бэкенда, чтобы не было ошибок 404
    //     return {};
    // }
};