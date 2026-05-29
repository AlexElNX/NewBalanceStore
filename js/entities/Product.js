export class Product {
  name;
  oldPrice;
  price;
  size;
  color;
  category;
  description;
  manufacturer;
  inStock;

  constructor(name = "Unknown", oldPrice = 0, price = 0, size = 0, color = "", category = "", description = "Unknown", manufacturer = "Unknown", inStock = false) {
    this.name = name;
    this.oldPrice = oldPrice;
    this.price = price;
    this.size = size;
    this.color = color;
    this.category = category;
    this.description = description;
    this.manufacturer = manufacturer;
    this.inStock = inStock;
  }

  print() {
    console.log(`Product ${this.name} was ${this.oldPrice}, now ${this.price}.
    \nSize: ${this.size}
    \nColor: ${this.color}
    \nCategory: ${this.category}
    \nDescription - ${this.description}.
    \nManufacturer - ${this.manufacturer}.
    \nIs available - ${this.inStock}`);
  }

  isAvailable() {
    return this.inStock;
  }
}
