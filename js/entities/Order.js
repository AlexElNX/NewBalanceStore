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


  createOrder(orderId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`Order created: ${orderId}`);
      }, 1000);
    });
  }

  processOrder(orderId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`Order processed: ${orderId}`);
      }, 2000);
    });
  }


  deliveryOrder(orderId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`Order delivered: ${orderId}`);
      }, 3000);
    });
  }
}


