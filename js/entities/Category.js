export class Category {
  name;
  description;
  products;
  gender;
  season;

  constructor(name = "", description = "", products = [], gender = "", season = "") {
    this.name = name;
    this.description = description;
    this.products = products;
    this.gender = gender;
    this.season = season;
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
