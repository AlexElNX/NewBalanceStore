import { getRecentlyViewed } from "../utils/recentlyViewed.js";
import { products } from "../data/productsData.js";
import { removeFromCart } from "../utils/cartStorage.js";

export class Cart {
  products;
  deliveryPrice;

  constructor(products = [], deliveryPrice = 0) {
    this.products = products;
    this.deliveryPrice = deliveryPrice;
  }

  addProduct(product) {
    this.products.push(product);
  }
  removeProduct(productId, color, size) {
    this.products = this.products.filter(
      item => !(
        item.product.id === productId &&
        item.color === color &&
        item.size === size
      )
    );
  }

  getTotalPrice() {
    return this.products.reduce(
      (sum, cartItem) => sum + cartItem.product.price * cartItem.quantity,
      0
    );
  }

  renderRecentlyViewed() {
    const recentContainer = document.querySelector(".recently-viewed-container");

    recentContainer.innerHTML = "";

    const recentSection = this.createRecentlyViewedSection();

    if (recentSection) {
      recentContainer.append(recentSection);
    }
  }


  updateSummary() {
    this.container.innerHTML = "";

    const cartLayout = document.createElement("div");
    cartLayout.classList.add("cart-container");

    cartLayout.append(
      this.createItemsSection(),
      this.createSummarySection()
    );

    this.container.append(cartLayout);

    this.renderRecentlyViewed();
  }
  render(container) {
    this.container = document.createElement("div");

    const cartLayout = document.createElement("div");
    cartLayout.classList.add("cart-container");

    cartLayout.append(
      this.createItemsSection(),
      this.createSummarySection()
    );

    this.container.append(cartLayout);

    container.append(this.container);

    this.renderRecentlyViewed();
  }



  createItemsSection() {
    const section = document.createElement("div");

    const header = document.createElement("div");
    header.classList.add("cart-header");

    const title = document.createElement("h2");
    title.textContent = "My Bag";

    const count = document.createElement("span");
    count.classList.add("cart-item-count");

    const totalItems = this.products.reduce(
      (sum, cartItem) => sum + cartItem.quantity,
      0
    );
    if(this.products.length === 1) {
      count.textContent = `${totalItems} Item`;
    }
    else {
      count.textContent = `${totalItems} Items`;
    }

    header.append(title, count);

    section.append(header);

    this.products.forEach(product => {
      section.append(this.createCartItem(product));
    });

    return section;
  }

  createCartItem(cartProduct) {
    const product = cartProduct.product;

    const item = document.createElement("div");
    item.classList.add("cart-item");

    const colorMap = {
      white1: "White",
      white2: "White",
      black_and_white: "Black & White",
      black: "Black",
      gray: "Gray",
      tan: "Tan",
      green: "Green",
      blue: "Blue",
      purple: "Purple",
      pink: "Pink",
      red: "Red",
      multi_color: "Multi Color"
    };

    const color = cartProduct.color;

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("cart-item-image");

    const image = document.createElement("img");
    image.src = product.images[color][0];
    image.alt = product.name;

    imageWrapper.append(image);

    const info = document.createElement("div");
    info.classList.add("cart-item-info");

    const title = document.createElement("h3");
    title.classList.add("cart-item-title");
    title.textContent = product.name;

    const gender = document.createElement("p");
    gender.classList.add("cart-item-text");
    gender.textContent = product.gender;

    const colorText = document.createElement("p");
    colorText.classList.add("cart-item-text");
    colorText.textContent = `Color: ${colorMap[color] || color}`;

    const sizeText = document.createElement("p");
    const size = cartProduct.size
    sizeText.classList.add("cart-item-text");
    sizeText.textContent = `Size: ${size}`;

    const qtyRow = document.createElement("div");
    qtyRow.classList.add("qty-row");

    const minus = document.createElement("button");
    minus.classList.add("qty-btn");
    minus.textContent = "-";
    minus.addEventListener("click", () => {
      if(cartProduct.quantity > 1) {
        --cartProduct.quantity;
        qty.textContent = `Qty: ${cartProduct.quantity}`;
        updatePrice();
        this.updateSummary();

      }
    })

    const qty = document.createElement("span");
    let quantity = cartProduct.quantity;
    qty.textContent = `Qty: ${quantity}`;


    const plus = document.createElement("button");
    plus.classList.add("qty-btn");
    plus.textContent = "+";
    plus.addEventListener("click", () => {
      if(cartProduct.quantity < 5) {
        ++cartProduct.quantity;
        qty.textContent = `Qty: ${cartProduct.quantity}`;
        updatePrice();
        this.updateSummary();
      }
    })

    qtyRow.append(minus, qty, plus);

    info.append(
      title,
      gender,
      colorText,
      sizeText,
      qtyRow
    );

    const price = document.createElement("div");
    price.classList.add("cart-price");

    const updatePrice = () => {
      price.textContent = `$${(product.price * cartProduct.quantity).toFixed(2)}`;
    }
    updatePrice();

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.classList.add("remove-btn");

    removeBtn.addEventListener("click", () => {

      removeFromCart(
        product.id,
        cartProduct.color,
        cartProduct.size
      );

      this.removeProduct(
        product.id,
        cartProduct.color,
        cartProduct.size
      );


      this.updateSummary();
    });

    const actions = document.createElement("div");
    actions.classList.add("cart-item-actions");

    actions.append(
      removeBtn,
      price
    );

    item.append(
      imageWrapper,
      info,
      actions
    );

    return item;
  }

  createSummarySection() {
    const summary = document.createElement("div");
    summary.classList.add("cart-summary");

    const title = document.createElement("h3");
    title.textContent = "Order Summary";

    const subtotal = this.createSummaryRow(
      "Subtotal",
      `$${this.getTotalPrice().toFixed(2)}`
    );

    const shipping = this.createSummaryRow(
      "Shipping: Standard",
      "FREE"
    );

    const tax = this.createSummaryRow(
      "Sales tax",
      "Calculated at checkout"
    );

    const total = document.createElement("div");
    total.classList.add("summary-total");

    const totalText = document.createElement("span");
    totalText.textContent = "Order total";

    const totalPrice = document.createElement("span");
    totalPrice.textContent =
      `$${this.getTotalPrice().toFixed(2)}`;

    total.append(
      totalText,
      totalPrice
    );

    const checkoutBtn = document.createElement("button");
    checkoutBtn.classList.add("checkout-btn");
    checkoutBtn.textContent = "Checkout";

    summary.append(
      title,
      subtotal,
      shipping,
      tax,
      total,
      checkoutBtn
    );

    return summary;
  }

  createSummaryRow(left, right) {
    const row = document.createElement("div");
    row.classList.add("summary-row");

    const leftText = document.createElement("span");
    leftText.textContent = left;

    const rightText = document.createElement("span");
    rightText.textContent = right;

    row.append(
      leftText,
      rightText
    );

    return row;
  }


  createRecentlyViewedSection() {

    const ids = getRecentlyViewed() || [];

    const items = ids
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);

    if(items.length === 0) {
      return null;
    }

    const section = document.createElement("section");
    section.classList.add("recently-viewed-section");

    const title = document.createElement("h2");
    title.textContent = "Recently viewed";

    const wrapper = document.createElement("div");
    wrapper.classList.add("recently-viewed-grid");

    items.forEach(product => {
      wrapper.append(product.createCard());
    });

    section.append(
      title,
      wrapper
    );

    return section;
  }
}
