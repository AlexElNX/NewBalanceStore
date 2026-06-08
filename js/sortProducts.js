export function sortProducts(productsToSort, sortType) {
  const sortedProducts = [...productsToSort];

  switch (sortType) {
    case "price-low":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sortedProducts.sort((a, b) => b.isNew - a.isNew);
      break;
    case "available":
      sortedProducts.sort((a, b) => b.inStock - a.inStock);
      break;
    case "featured":
    default:
      break;
  }
  return sortedProducts;
}
