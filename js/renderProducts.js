const grid = document.querySelector("#product-grid");

export function renderProducts(productsToRender) {
  grid.innerHTML = "";

  productsToRender.forEach(product => {
    grid.append(product.createCard());
  });
}

