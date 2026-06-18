export class Customer {
  firstName;
  lastName;
  email;
  address;
  phoneNumber;

  constructor(firstName = "", lastName = "", email = "", address = "", phoneNumber = "") {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.address = address;
    this.phoneNumber = phoneNumber;
  }
}
