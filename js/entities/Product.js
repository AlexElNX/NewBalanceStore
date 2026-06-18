import { openProductDrawer } from "/js/productDrawer.js";

export class Product {
  id;
  images;
  name;
  oldPrice;
  price;
  sizes;
  colors;
  gender;
  type;
  category;
  activity;
  description;
  isNew;
  inStock;


  constructor(id = 0,
              name = "Unknown",
              price = 0,
              oldPrice = 0,
              gender = "Unknown",
              type = "Unknown",
              category = "Unknown",
              activity = "Unknown",
              description = "Unknown",
              images = [],
              colors = [],
              sizes = [],
              isNew = false,
              inStock = true
  ) {
    this.id = id;
    this.images = images;
    this.name = name;
    this.oldPrice = oldPrice;
    this.price = price;
    this.sizes = sizes;
    this.colors = colors;
    this.gender = gender;
    this.type = type;
    this.category = category;
    this.activity = activity;
    this.description = description;
    this.isNew = isNew;
    this.inStock = inStock;
  }

  createCard() {
    const card = document.createElement("div");
    card.classList.add('product-card');

    let activeColor = Object.keys(this.images)[0];
    const colors = Object.keys(this.images);

    const image = document.createElement("img");
    image.src = this.images[activeColor][0];
    image.alt = this.name;
    image.classList.add('main-product-image');

    const newBadge = document.createElement("span");
    if(this.isNew) {
      newBadge.textContent = "New";
      newBadge.classList.add("new-badge");
    }

    const title = document.createElement("a");
    title.textContent = this.name;
    title.classList.add('product-title');

    title.href = `product.html?id=${this.id}`;

    const subtitle = document.createElement("span");
    subtitle.textContent = `${this.gender} ${this.category}`;
    subtitle.classList.add('product-subtitle');

    const price = document.createElement("span");
    price.textContent = `$${this.price}`;
    price.classList.add('product-price');

    if(this.oldPrice) {
      const oldPrice = document.createElement("span");
      oldPrice.textContent = `$${this.oldPrice}`;
      oldPrice.classList.add('old-price');

      price.append(oldPrice);
    }


    const sliderWrapper = document.createElement("div");
    sliderWrapper.classList.add("color-slider-wrapper");

    const prevBtn = document.createElement("button");
    prevBtn.classList.add("slider-btn", "prev");
    prevBtn.innerHTML = "❮";

    const nextBtn = document.createElement("button");
    nextBtn.classList.add("slider-btn", "next");
    nextBtn.innerHTML = "❯";

    const colorSlider = document.createElement("div");
    colorSlider.classList.add("color-slider");

    const VISIBLE_COLORS = 8;
    let startIndex = 0;

    const renderColors = () => {
      colorSlider.innerHTML = "";
      image.addEventListener("mouseenter", () => {
        const colorImages = this.images[activeColor];

        if(colorImages.length > 1) {
          image.src = colorImages[1];
        }
      });

      image.addEventListener("mouseleave", () => {
        image.src = this.images[activeColor][0];
      });


      colors
        .slice(startIndex, startIndex + VISIBLE_COLORS)
        .forEach(color => {

          const colorImage = document.createElement("img");
          colorImage.src = this.images[color][0];

          if(color === activeColor) {
            colorImage.classList.add('active');
          }

          colorImage.addEventListener("click", () => {
            activeColor = color;
            image.src = this.images[color][0];
            renderColors();
          });

          colorSlider.append(colorImage);
        });


      prevBtn.style.visibility =
        startIndex === 0 ? "hidden" : "visible";

      nextBtn.style.visibility =
        startIndex + VISIBLE_COLORS >= colors.length ? "hidden" : "visible";
    };

    prevBtn.addEventListener("click", () => {
      if (startIndex > 0) {
        startIndex--;
        renderColors();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (startIndex + VISIBLE_COLORS < colors.length) {
        startIndex++;
        renderColors();
      }
    });

    if (colors.length <= VISIBLE_COLORS) {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    }




    const quickAddBtn = document.createElement("button");
    quickAddBtn.classList.add('quick-add-btn');
    quickAddBtn.innerHTML = `<img src="/NewBalanceShop/img/svg/header/bag.svg" alt="bag">`;

    quickAddBtn.addEventListener("click", () => {
      openProductDrawer(this, activeColor);
    });


    renderColors();

    sliderWrapper.append(
      prevBtn,
      colorSlider,
      nextBtn
    );

    card.append(
      image,
      quickAddBtn,
      sliderWrapper,
      newBadge,
      title,
      subtitle,
      price
    );

    return card;
  }
}
