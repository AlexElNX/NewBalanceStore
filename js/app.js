// import { Cart } from './entities/Cart.js';
// import { Category } from "./entities/Category.js";
// import { Customer } from "./entities/Customer.js";
// import { Manufacturer } from "./entities/Manufacturer.js";
// import { Order } from "./entities/Order.js";
import { products } from "./data/productsData.js";
import { filterProducts } from "./filters/filterProducts.js";
import { renderProducts } from "./renderProducts.js";
import { activeFilters } from "./filters/activeFilters.js";
import { updateClearButton } from "./pageFilters.js";
import { updateVisibleFilters } from "./pageFilters.js";


document.addEventListener("componentsLoaded", () => {
  const header = document.querySelector('.main-header');
  const hero = document.querySelector('.hero');

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll <= 70) {
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

    header.classList.add('scrolled', 'fixed');

    if (currentScroll > lastScroll) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }

    lastScroll = currentScroll;
  });
});


document.querySelectorAll('.filter-group h4').forEach(title => {
  title.addEventListener('click', () => {
    title.parentElement.classList.toggle('active');
  });
});



document.querySelectorAll('.filter-option').forEach(option => {
  option.addEventListener('click', () => {

    const filterType = option.dataset.filter;
    const value = option.dataset.value.toLowerCase();

    option.classList.toggle('active');

    if(option.classList.contains('active')) {
      activeFilters[filterType].push(value);
    }
    else {
      activeFilters[filterType] = activeFilters[filterType].filter(item => item !== value);
    }
    updateClearButton();

    const productsToRender = filterProducts(products);
    renderProducts(productsToRender);
    updateVisibleFilters(productsToRender);


  });

});

try {
  const response = await fetch("./js/data/banner.json");

  if(!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();

  console.log(data);
}
catch (error) {
  console.error(error);
}
