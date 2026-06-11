import { addToRecentlyViewed } from "/NewBalanceShop/js/utils/recentlyViewed.js";
import { addToCart } from "/NewBalanceShop/js/utils/cartStorage.js";

export function openProductDrawer(product) {

  addToRecentlyViewed(product);

  const name = document.querySelector("#drawer-name");
  const price = document.querySelector("#drawer-price");

  name.textContent = product.name;

  if(product.oldPrice) {
    price.innerHTML = `
    <span class="current-price">$${product.price}</span>
    <span class="old-price">$${product.oldPrice}</span>`;
  }
  else {
    price.innerHTML = `<span class="current-price">$${product.price}</span>`;
  }

  let activeColor = Object.keys(product.images)[0];
  let activeSize = null;

  const gallery = document.querySelector("#drawer-gallery");
  const renderGallery = () => {

    gallery.innerHTML = "";

    const images = product.images[activeColor];

    images.forEach(src => {

      const img = document.createElement("img");

      img.src = src;
      img.alt = product.name;

      gallery.append(img);
    });
  };

  const colorsContainer = document.querySelector("#drawer-colors");
  const renderColors = () => {

    colorsContainer.innerHTML = "";

    const colors = Object.keys(product.images);

    colors.forEach(color => {

      const btn = document.createElement("button");

      btn.classList.add("drawer-color");

      if(color === activeColor) {
        btn.classList.add("active");
      }

      const img = document.createElement("img");

      img.src = product.images[color][0];

      img.alt = color;

      btn.append(img);

      btn.addEventListener("click", () => {

        activeColor = color;

        renderGallery();
        renderColors();

      });
      colorsContainer.append(btn);
    });
  };


  const sizesContainer = document.querySelector("#drawer-sizes");
  const renderSizes = () => {

    sizesContainer.innerHTML = "";

    let allSizes = [];

    if(product.type === "Footwear" || product.category === "Shoes") {
      allSizes = [
        7,
        7.5,
        8,
        8.5,
        9,
        9.5,
        10,
        10.5,
        11,
        11.5
      ];
    }
    else {
      allSizes = [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "2XL"
      ];
    }

    allSizes.forEach(size => {
      const btn = document.createElement("button");

      btn.classList.add("drawer-size");

      btn.textContent = size;

      const available = product.sizes.includes(size);

      if(!available) {
        btn.classList.add("unavailable");
      }
      else {
        btn.addEventListener("click", () => {

          document.querySelectorAll(".drawer-size.active")
            .forEach(el => el.classList.remove("active"));

          btn.classList.add("active");

          activeSize = size;
        });
      }

      sizesContainer.append(btn);
    });
  };

  renderGallery();
  renderColors();
  renderSizes();

  const addToCartBtn =
    document.querySelector("#drawer-add-to-cart");

  addToCartBtn.onclick = () => {

    if (!activeSize) {
      alert("Please select a size");
      return;
    }

    addToCart(
      product,
      activeColor,
      activeSize
    );

    closeDrawer();
  };


  const drawer = document.querySelector(".product-drawer");
  const overlay = document.querySelector(".product-drawer-overlay");

  drawer.classList.add("open");
  overlay.classList.add("open");

  document.body.style.overflow = "hidden";


  const closeDrawer = () => {

    drawer.classList.remove("open");
    overlay.classList.remove("open");

    document.body.style.overflow = "";

    closeBtn.removeEventListener("click", closeDrawer);

    overlay.removeEventListener("click", closeDrawer);

  };

  const closeBtn = document.querySelector(".drawer-close");

  closeBtn.addEventListener("click", closeDrawer);

  overlay.addEventListener("click", closeDrawer);

}
