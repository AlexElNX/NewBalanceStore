import { Product } from "../entities/Product.js";

export const products = [

  new Product(
    1,
    "9060",
    459.99,
    999.99,
    "Unisex",
    "Footwear",
    "Shoes",
    "Lifestyle",
    "Lifestyle sneaker",
    {
      white: [
        "img/products/9060/white/9060-white1.jpg",
        "img/products/9060/white/9060-white2.jpg",
        "img/products/9060/white/9060-white3.jpg",
        "img/products/9060/white/9060-white4.jpg",
        "img/products/9060/white/9060-white5.jpg",
        "img/products/9060/white/9060-white6.jpg",
        "img/products/9060/white/9060-white7.jpg",
        "img/products/9060/white/9060-white8.jpg",
        "img/products/9060/white/9060-white9.jpg"
      ],
      black: [
        "img/products/9060/black/9060-black1.jpg",
        "img/products/9060/black/9060-black2.jpg"
      ],
      gray: [
        "img/products/9060/gray/9060-gray1.jpg",
        "img/products/9060/gray/9060-gray2.jpg"
      ],
      tan: [
        "img/products/9060/tan/9060-tan1.jpg",
        "img/products/9060/tan/9060-tan2.jpg"
      ]
    },

    ["white", "gray", "black", "tan"],
    [7, 7.5, 8, 8.5, 9, 9.5],
  ),

  new Product(
    2,
    "2002R",
    149.99,
    null,
    "Unisex",
    "Footwear",
    "Shoes",
    "Lifestyle",
    "Lifestyle sneaker",
    {
      white: [
      "img/products/2002R/white/2002R-White.jpg"
      ],
      black: [
        "img/products/2002R/black/2002R-Black.jpg"
      ],
      gray: [
        "img/products/2002R/gray/2002R-Gray.jpg"
      ]
    },
    ["black", "gray", "white"],
    [7, 7.5, 8, 8.5, 9, 9.5],
    true
  ),

  new Product(
    3,
    "530",
    109.99,
    null,
    "Unisex",
    "Footwear",
    "Shoes",
    "Lifestyle",
    "Lifestyle Socks",
    {
      white1: [
        "img/products/530/white-1/530-White1.jpg"
      ],
      white2: [
        "img/products/530/white-2/530-White1.jpg"
      ],
      black: [
        "img/products/530/black/530-Black.jpg"
      ],
      black_and_white: [
        "img/products/530/black-and-white/530-Black-And-White.jpg"
      ],
      gray: [
        "img/products/530/gray/530-Gray.jpg"
      ],
      tan: [
        "img/products/530/tan/530-Tan.jpg"
      ],
      pink: [
        "img/products/530/pink/530-Pink.jpg"
      ]
    },

    ["white", "white", "black", "pink", "gray", "black", "tan"],
    [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5],
  ),

  new Product(
    4,
    "Soccer T-Shirt",
    39.99,
    null,
    "Unisex",
    "Clothing",
    "Shirts",
    "Soccer",
    "Soccer T-Shirt",
    {
      white1: [
        "img/products/Soccer-Shirt/white/soccer-shirt-white1.jpg",
        "img/products/Soccer-Shirt/white/soccer-shirt-white2.jpg"
      ],
      red: [
        "img/products/Soccer-Shirt/red/soccer-shirt-red1.jpg",
        "img/products/Soccer-Shirt/red/soccer-shirt-red2.jpg"
      ],
      black: [
        "img/products/Soccer-Shirt/black/soccer-shirt-black1.jpg",
        "img/products/Soccer-Shirt/black/soccer-shirt-black2.jpg"
      ]
    },

    ["white", "red", "black"],
    ["XS", "S", "M", "L"],
  ),

  new Product(
    5,
    "Klutch Crew 2 Pack",
    19.99,
    null,
    "Unisex",
    "Clothing",
    "Shirts",
    "Soccer",
    "Soccer T-Shirt",
    {
      multi_color: [
        "img/products/Klutch-Crew-2-Pack/Klutch-Crew-2-Pack-1.jpg",
        "img/products/Klutch-Crew-2-Pack/Klutch-Crew-2-Pack-2.jpg",
        "img/products/Klutch-Crew-2-Pack/Klutch-Crew-2-Pack-3.jpg"
      ]
    },

    ["multi color"],
    ["S", "M", "L", "XL"],
  )

];




