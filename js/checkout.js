import { getCart } from "./utils/cartStorage.js";
import { products } from "./data/productsData.js";
import { Order } from "./entities/Order.js";
import { Customer } from "./entities/Customer.js";

const cartItems = getCart();

const productsContainer = document.querySelector(".checkout-products");

const subtotalElement = document.querySelector(".subtotal span:last-child");

const totalElement = document.querySelector(".order-total span:last-child");

const template = document.querySelector("#checkout-product-template");

let subtotal = 0;

const colorMap = {
  white1: "White",
  white2: "White",
  black_and_white: "Black & White",
  black: "Black",
  gray: "Gray",
  tan: "Tan",
  green: "Green",
  blue: "Blue",
  purple: "Purple",
  pink: "Pink",
  red: "Red",
  multi_color: "Multi Color"
};

cartItems.forEach(item => {

  const product = products.find(
    p => p.id === item.productId
  );

  if (!product) return;

  subtotal += product.price * item.quantity;

  const card = template.content.firstElementChild.cloneNode(true);

  card.querySelector(".checkout-product-image").src = product.images[item.color][0];

  card.querySelector(".checkout-product-image").alt = product.name;

  card.querySelector(".checkout-product-name").textContent = product.name;

  card.querySelector(".checkout-product-gender").textContent = product.gender;

  card.querySelector(".checkout-product-color").textContent =
    `Color: ${
      colorMap[item.color] || item.color
    }`;

  card.querySelector(".checkout-product-size").textContent =
    `Size: ${item.size}`;

  card.querySelector(".checkout-product-quantity").textContent =
    `Qty: ${item.quantity}`;

  card.querySelector(".checkout-product-price").textContent =
    `$${(
      product.price * item.quantity
    ).toFixed(2)}`;

  productsContainer.append(card);

});

subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

totalElement.textContent = `$${subtotal.toFixed(2)}`;

document.querySelector(".continue-btn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const phoneNumber = document.getElementById("phone").value.trim();

  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();

  const address = document.getElementById("address").value.trim();

  if(email.length < 5 || !email.includes("@")) {
    alert("Please enter a valid email");
    return;
  }

  if(phoneNumber.length < 10) {
    alert("Please enter a valid phone number");
    return;
  }

  if(firstName.length < 2) {
    alert("Please enter your first name");
    return;
  }

  if(lastName.length < 2) {
    alert("Please enter your last name");
    return;
  }

  if(address.length < 5) {
    alert("Please enter your address");
    return;
  }
  const customer = new Customer(firstName, lastName, email, address, phoneNumber);

  console.log(`Customer first name: ${customer.firstName}`)
  console.log(`Customer last name: ${customer.lastName}`)
  console.log(`Customer email: ${customer.email}`)
  console.log(`Customer phone number: ${customer.phoneNumber}`)
  console.log(`Customer address: ${customer.address}`)

  const orderId = 1;
  const order = new Order();
  order.createOrder(orderId)
    .then(result => {
      console.log(result);
      return order.processOrder(orderId);
    })
    .then(result => {
      console.log(result);
      return order.deliveryOrder(orderId);
    })
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.log(error);
    });
});
