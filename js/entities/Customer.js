export class Customer {
  name;
  email;
  address;
  orders;

  constructor(name = "", email = "", address = "", orders = []) {
    this.name = name;
    this.email = email;
    this.address = address;
    this.orders = orders;
  }

  changeAddress(newAddress) {
    this.address = newAddress;
  }
  changeEmail(newEmail) {
    this.email = newEmail;
  }
}
