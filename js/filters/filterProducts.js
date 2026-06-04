import { activeFilters } from "./activeFilters.js";

export function filterProducts(products) {

  return products.filter(product => {

    const colorMatch =
      activeFilters.colors.length === 0 ||
      product.colors.some(color => activeFilters.colors.includes(color.toLowerCase()));

    const sizeMatch =
      activeFilters.sizes.length === 0 ||
      product.sizes.some(size => activeFilters.sizes.includes(size.toString()));

    const priceMatch =
      activeFilters.price.length === 0 ||
      activeFilters.price.some(range => {
        if(!range.includes("-")) {
          const min = Number(range);
          return product.price >= min;
        }

        const [min, max] = range.split("-").map(Number);
        return product.price >= min && product.price <= max;
      });

    const genderMatch =
      activeFilters.gender.length === 0 ||
      activeFilters.gender.includes(product.gender.toLowerCase());

    const activityMatch =
       activeFilters.activity.length === 0 ||
      activeFilters.activity.includes(product.activity.toLowerCase());

    const categoryMatch =
      activeFilters.category.length === 0 ||
      activeFilters.category.includes(product.category.toLowerCase());

    return colorMatch && sizeMatch && priceMatch && genderMatch && activityMatch && categoryMatch;
  });

}
