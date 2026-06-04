import { Product } from "../entities/Product.js";

export const products = [

  new Product(
    1,
    "9060",
    459.99,
    null,
    "Men",
    "Shoes",
    "Lifestyle",
    "Lifestyle sneaker",
    [
      "img/products/9060/white/9060-white1.jpg",
      "img/products/9060/gray/9060-gray1.jpg",
      "img/products/9060/black/9060-black1.jpg",
      "img/products/9060/tan/9060-tan1.jpg",
    ],
    ["white", "gray", "black"],
    [7, 7.5, 8, 8.5, 9, 9.5],
    5
  ),

  new Product(
    2,
    "2002R",
    149.99,
    null,
    "Unisex",
    "Shoes",
    "Lifestyle",
    "Lifestyle sneaker",
    [
      "img/products/2002R/black/2002R-Black.jpg",
      "img/products/2002R/gray/2002R-Gray.jpg",
      "img/products/2002R/white/2002R-White.jpg"
    ],
    ["black", "gray", "white"],
    [7, 7.5, 8, 8.5, 9, 9.5],
    5
  ),

  new Product(
    3,
    "530",
    109.99,
    null,
    "Unisex",
    "Shoes",
    "Lifestyle",
    "Lifestyle sneaker",
    [
      "img/products/530/white-1/530-White1.jpg",
      "img/products/530/white-2/530-White2.jpg",
      "img/products/530/black/530-Black.jpg",
      "img/products/530/pink/530-Pink.jpg",
      "img/products/530/gray/530-Gray.jpg",
      "img/products/530/black-and-white/530-Black-And-White.jpg",
      "img/products/530/tan/530-Tan.jpg"
    ],
    ["white", "white", "black", "pink", "gray", "black", "tan"],
    [7, 7.5, 8, 8.5, 9, 9.5],
    5
  )


];




