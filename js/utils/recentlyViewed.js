import { getCookie, setCookie } from "./cookies.js";

const KEY = "recently_viewed";

export function addToRecentlyViewed(product) {
  let items = getCookie(KEY);

  items = items.filter(id => id !== product.id);

  items.unshift(product.id);

  if (items.length > 5) {
    items = items.slice(0, 5);
  }

  setCookie(KEY, items, 7);
}

export function getRecentlyViewed() {
  return getCookie(KEY);
}
