// import { Product } from './entities/Product.js';
// import { Cart } from './entities/Cart.js';
// import { Category } from "./entities/Category.js";
// import { Customer } from "./entities/Customer.js";
// import { Manufacturer } from "./entities/Manufacturer.js";
// import { Order } from "./entities/Order.js";

const header = document.querySelector('.main-header');
const hero = document.querySelector('.hero');

let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll <= 0) {
    header.style.position = 'absolute';
    header.style.width = '100%';
    header.style.left = '0';

    header.classList.remove('fixed', 'hidden', 'scrolled');
    lastScroll = 0;
    return;
  }

  header.style.position = 'fixed';
  header.style.width = `${hero.offsetWidth}px`;
  header.style.left = `${hero.getBoundingClientRect().left}px`;

  header.classList.add('scrolled');
  header.classList.add('fixed');

  if (currentScroll > lastScroll) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }

  lastScroll = currentScroll;
});
