import { products } from "../js/data/productsData.js";
import { Cart } from "../js/entities/Cart.js";
import { getCart } from "../js/utils/cartStorage.js";

const cartMain = document.querySelector(".cart-main");

const cartItems = getCart().map(item => ({
  product: products.find(
    p => p.id === item.productId
  ),
  color: item.color,
  size: item.size,
  quantity: item.quantity
}));

const cart = new Cart(cartItems);

cart.render(cartMain);
