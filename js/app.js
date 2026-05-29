import { Product } from './entities/Product.js';
import { Cart } from './entities/Cart.js';
import { Category } from "./entities/Category.js";
import { Customer } from "./entities/Customer.js";
import { Manufacturer } from "./entities/Manufacturer.js";
import { Order } from "./entities/Order.js";

const manufacturer = new Manufacturer(
  "New Balance",
  "USA",
  1906,
  "https://www.newbalance.com"
);

const category = new Category(
  "Running Shoes",
  "Shoes for running and everyday wear",
  [],
  "Unisex",
  "All season"
);

const product1 = new Product(
  "New Balance 9060",
  220,
  180,
  44,
  "Gray",
  category.name,
  "Comfortable lifestyle sneakers",
  manufacturer.name,
  true
);

const product2 = new Product(
  "New Balance 530",
  140,
  110,
  43,
  "White",
  category.name,
  "Classic running sneakers",
  manufacturer.name,
  true
);

manufacturer.addProduct(product1);
manufacturer.addProduct(product2);

category.addProduct(product1);
category.addProduct(product2);

const cart = new Cart(
  [],
  0,
  15,
  10
);

cart.addProduct(product1);
cart.addProduct(product2);

const customer = new Customer(
  "Jon",
  "jon@gmail.com",
  "New York, USA",
  []
);

const order = new Order(
  "ORD-001",
  cart.products,
  customer.name,
  "Processing",
  "05.28.2026"
);

customer.orders.push(order);

product1.print();
product2.print();

manufacturer.printInfo();

category.showProducts();

customer.showOrders();

order.printOrder();

console.log(cart);
