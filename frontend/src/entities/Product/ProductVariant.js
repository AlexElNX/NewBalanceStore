export class ProductVariant {
    /** @type {string} Колір варіації */
    color;
    /** @type {number} Числовий розмір взуття/одягу */
    size;
    /** @type {number} Залишок одиниць товару на складі */
    quantity;

    /**
     * Створює екземпляр варіації товару з нормалізацією розміру в числовий тип.
     * @param {Object} data
     * @param {string} data.color
     * @param {string | number} data.size
     * @param {number} data.quantity
     */
    constructor(data) {
        this.color = data.color;
        const numericSize = Number(data.size);
        this.size = Number.isNaN(numericSize) ? data.size : numericSize;
        this.quantity = data.quantity;
    }
}