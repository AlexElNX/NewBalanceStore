import { products } from "/NewBalanceShop/js/data/productsData.js";
import { filterProducts } from "/NewBalanceShop/js/filters/filterProducts.js";
import { renderProducts } from "/NewBalanceShop/js/renderProducts.js";
import { activeFilters } from "/NewBalanceShop/js/filters/activeFilters.js";
import { updateClearButton } from "/NewBalanceShop/js/pageFilters.js";
import { updateVisibleFilters } from "/NewBalanceShop/js/pageFilters.js";

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
