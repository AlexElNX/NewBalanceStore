import { apiRequest } from "./api/apiClient.js";

/**
 * Отримує список замовлень поточного користувача з бекенду.
 */
export async function fetchUserOrders() {
    return apiRequest("/api/orders");
}

/**
 * Створює нове замовлення в системі.
 * @param {Object} orderData
 */
export async function createOrder(orderData) {
    return apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderData)
    });
}