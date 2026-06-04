import { products } from "./data/productsData.js";
import { renderProducts } from "./renderProducts.js";

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

const title = document.querySelector(".category-title");

function capitalize(str) {
  if(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);

  }
}

const isNew = params.get("new");
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



