export class Category {
  name;
  description;
  products;
  gender;

  constructor(name = "", description = "", products = [], gender = "") {
    this.name = name;
    this.description = description;
    this.products = products;
    this.gender = gender;
  }

  addProduct(product) {
    this.products.push(product);
  }

  showProducts() {
    for(let i = 0; i < this.products.length; ++i) {
      console.log('Product ' + i + ': ' + this.products[i].name);
    }
  }
}
