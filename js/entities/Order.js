export class Order {
  id;
  products;
  customer;
  status;
  date;

  constructor(id = "", products = [] ,customer = "", status = "", date = "") {
    this.id = id;
    this.products = products;
    this.customer = customer;
    this.status = status;
    this.date = date;
  }

  changeStatus(newStatus) {
    this.status = newStatus;
  }

}
