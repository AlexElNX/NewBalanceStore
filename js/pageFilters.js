import { products } from "./data/productsData.js";
import { renderProducts } from "./renderProducts.js";
import { sortProducts } from "./sortProducts.js";
import { activeFilters } from "./filters/activeFilters.js";

const params = new URLSearchParams(window.location.search);
let filteredProducts = products;

const gender = params.get("gender");
if(gender) {
  filteredProducts = filteredProducts.filter(product => {
    const productGender = product.gender.toLowerCase();
    const pageGender = gender.toLowerCase();

    if(pageGender === "kids") {
      return productGender === "kids";
    }
    return (
      productGender === pageGender ||
      productGender === "unisex"
    );
  });
}

const type = params.get("type");
if(type) {
  filteredProducts = filteredProducts.filter(product => product.type.toLowerCase() === type.toLowerCase());
}

const category = params.get("category");
if(category) {
  filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
}

const activity = params.get("activity");
if(activity) {
  filteredProducts = filteredProducts.filter(product => product.activity.toLowerCase() === activity.toLowerCase());
}



const sale = params.get("sale");
if(sale === "true") {
  filteredProducts = filteredProducts.filter(product => product.oldPrice);
}




function capitalize(str) {
  if(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

function setupPageFilters() {
  const footwearSize = document.querySelector(".footwear-size-filter");
  const clothingSize = document.querySelector(".clothing-size-filter");
  const accessoryType = document.querySelector(".accessory-type-filter");
  const activityType = document.querySelector(".activity-filter");

  if(type === "clothing") {
    footwearSize.style.display = "none";
    accessoryType.style.display = "none";
  }

  if(type === "accessories") {
    footwearSize.style.display = "none";
    clothingSize.style.display = "none";
    activityType.style.display = "none";
  }

  if(type === "footwear") {
    clothingSize.style.display = "none";
    accessoryType.style.display = "none";
  }
}

setupPageFilters();

export function updateVisibleFilters(products) {
  const hasFootwear = products.some(
    product => product.type.toLowerCase() === "footwear"
  );

  const hasClothing = products.some(
    product => product.type.toLowerCase() === "clothing"
  );

  const hasAccessories = products.some(
    product => product.type.toLowerCase() === "accessories"
  );

  const productTypeGroup = document.querySelector(".product-type-filter");

  const accessoryTypeSelected =
    activeFilters.category.includes("bags") ||
    activeFilters.category.includes("socks") ||
    activeFilters.category.includes("hats & gloves");

  const footwearSizeSelected =
    activeFilters.sizes.some(size =>
      !isNaN(Number(size))
    );

  const clothingSizeSelected =
    activeFilters.sizes.some(size =>
      ["xs", "s", "m", "l", "xl", "2xl", "3xl"].includes(size)
    );

  const hideProductType =
    accessoryTypeSelected ||
    footwearSizeSelected ||
    clothingSizeSelected;

  productTypeGroup.style.display =
    hideProductType ? "none" : "block";

  document.querySelector(".footwear-size-filter")
    .style.display = hasFootwear || footwearSizeSelected ? "block" : "none";

  document.querySelector(".clothing-size-filter")
    .style.display = hasClothing || clothingSizeSelected ? "block" : "none";

  document.querySelector(".accessory-type-filter")
    .style.display = hasAccessories || accessoryTypeSelected ? "block" : "none";
}


const isNew = params.get("new");

if(isNew === "true") {
  filteredProducts = filteredProducts.filter(product => product.isNew === true);
}

const title = document.querySelector(".category-title");

if(gender && activity) {
  title.textContent = `${capitalize(gender)} ${capitalize(activity)}`;
}
else if(gender && category) {
  title.textContent = `${capitalize(gender)} ${capitalize(category)}`;

}
else if(gender) {
  title.textContent = capitalize(gender);
}
else if(activity) {
  title.textContent = capitalize(activity);
}
else if(sale === "true") {
  title.textContent = "Sale";
}

else if(isNew === "true") {
  title.textContent = "New";
}
else {
  title.textContent = "All Products";
}


const breadcrumbs = document.querySelector(".breadcrumb");

if(sale === "true") {
  if(activity) {
    breadcrumbs.textContent = `Sale / ${capitalize(gender) ?? ""} / ${capitalize(category) ?? ""} / ${capitalize(activity)}`;
  }
  else if(category) {
    breadcrumbs.textContent = `Sale / ${capitalize(gender) ?? ""} / ${capitalize(category) ?? ""}`;
  }
  else if(gender) {
    breadcrumbs.textContent = `Sale / ${capitalize(gender) ?? ""}`;
  }
  else {
      breadcrumbs.textContent = `Sale`;
    }
}
else if(isNew === "true") {
  if(activity) {
    breadcrumbs.textContent = `New / ${capitalize(gender) ?? ""} / ${capitalize(category) ?? ""} / ${capitalize(activity)}`;
  }
  else if(category) {
    breadcrumbs.textContent = `New / ${capitalize(gender) ?? ""} / ${capitalize(category) ?? ""}`;
  }
  else if(gender) {
    breadcrumbs.textContent = `New / ${capitalize(gender) ?? ""}`;
  }
  else {
    breadcrumbs.textContent = `New`;
  }
}
else {
  if(activity) {
    breadcrumbs.textContent = `${capitalize(gender) ?? ""} / ${capitalize(category) ?? ""} / ${capitalize(activity)}`;
  }
  else if(category) {
    breadcrumbs.textContent = `${capitalize(gender) ?? ""} / ${capitalize(category) ?? ""}`;
  }
  else{
    breadcrumbs.textContent = `${capitalize(gender) ?? ""}`;
  }
}

renderProducts(filteredProducts);
updateVisibleFilters(filteredProducts);

const clearFiltersBtn = document.querySelector("#clear-filters-btn");
export function updateClearButton() {
  const hasActiveFilters = Object.values(activeFilters)
    .some(filter => filter.length > 0);

  clearFiltersBtn.style.display = hasActiveFilters ? "block" : "none";
}


document.querySelector("#clear-filters-btn").addEventListener("click", () => {
  Object.keys(activeFilters).forEach(key => {
    activeFilters[key] = [];
  });

  document.querySelectorAll(".filter-option.active")
    .forEach(btn => { btn.classList.remove("active")
    });

  renderProducts(filteredProducts);
  updateVisibleFilters(filteredProducts);

  updateClearButton();
});


const sortSelect = document.querySelector("#sort-select");
sortSelect.addEventListener("change", () => {
  const sortedProducts = sortProducts(filteredProducts, sortSelect.value);

  renderProducts(sortedProducts);
});




