export class Cart {
  products;
  totalPrice;
  deliveryPrice;
  discount;

  constructor(products = [], totalPrice = 0, deliveryPrice = 0, discount = 0) {
    this.products = products;
    this.totalPrice = totalPrice;
    this.deliveryPrice = deliveryPrice;
    this.discount = discount;
  }

  addProduct(product) {
    this.products.push(product);
  }
  removeProduct(product) {
    this.products.remove(product);
  }
  clearCart() {
    this.products.clear();
  }
}
