export class Manufacturer {
  name;
  country;
  year;
  website;
  products;

  constructor(name = "", country = "", year = 1900, website = "", products = []) {
    this.name = name;
    this.country = country;
    this.year = year;
    this.website = website;
    this.products = products;
  }

  addProduct(product) {
    this.products.push(product);
  }
  printInfo() {
    console.log('Company: ' + this.name + '. Country: ' + this.country + ', year: ' + this.year + ', website: ' + this.website);
  }
}
