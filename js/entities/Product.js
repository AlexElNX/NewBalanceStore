export class Product {
  id;
  images;
  name;
  oldPrice;
  price;
  sizes;
  colors;
  gender;
  category;
  activity;
  description;
  rating
  isNew;
  inStock;


  constructor(id = 0,
              name = "Unknown",
              price = 0,
              oldPrice = 0,
              gender = "Unknown",
              category = "",
              activity = "",
              description = "Unknown",
              images = [],
              colors = [],
              sizes = [],
              rating = 0,
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
    this.category = category;
    this.activity = activity;
    this.description = description;
    this.rating = rating;
    this.isNew = isNew;
    this.inStock = inStock;
  }

  createCard() {
    const card = document.createElement("div");
    card.classList.add('product-card');

    const image = document.createElement("img");
    image.src = this.images[0];
    image.alt = this.name;
    image.classList.add('main-product-image');

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

    const rating = document.createElement("p");
    rating.textContent = "⭐".repeat(this.rating);
    rating.classList.add('product-rating');



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
    let activeImage = this.images[0];

    const renderColors = () => {
      colorSlider.innerHTML = "";

      this.images
        .slice(startIndex, startIndex + VISIBLE_COLORS)
        .forEach(imagePath => {

          const colorImage = document.createElement("img");
          colorImage.src = imagePath;

          if(imagePath === activeImage) {
            colorImage.classList.add('active');
          }

          colorImage.addEventListener("click", () => {
            activeImage = imagePath;
            image.src = imagePath;
            renderColors();
          });

          colorSlider.append(colorImage);
        });

      prevBtn.style.visibility =
        startIndex === 0 ? "hidden" : "visible";

      nextBtn.style.visibility =
        startIndex + VISIBLE_COLORS >= this.images.length ? "hidden" : "visible";
    };

    prevBtn.addEventListener("click", () => {
      if (startIndex > 0) {
        startIndex--;
        renderColors();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (startIndex + VISIBLE_COLORS < this.images.length) {
        startIndex++;
        renderColors();
      }
    });

    if (this.images.length <= VISIBLE_COLORS) {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    }

    renderColors();

    sliderWrapper.append(
      prevBtn,
      colorSlider,
      nextBtn
    );

    card.append(
      image,
      sliderWrapper,
      title,
      subtitle,
      price
    );

    return card;
  }
}
