import { createProduct } from "../factory/productFactory.js";
import { fetchProducts } from "./api/productsApi.js";

export function isInStock(product) {
    return Boolean(product?.variants?.some(variant => Number(variant.quantity) > 0));
}

export async function getProducts() {
    const data = await fetchProducts();

    return data.map(createProduct);
}