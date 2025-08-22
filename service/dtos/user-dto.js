export default class UserDTO {
  _id;
  role;
  image;
  firstName;
  lastName;
  phoneNumber;
  email;
  isActivated;

  // Optional fields
  stores;
  sellers;
  customerStoreId;
  likedProducts;
  cartProducts;
  orders;

  constructor(model) {
    this._id = model._id;
    this.role = model.role;
    this.image = model.image;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.phoneNumber = model.phoneNumber;
    this.email = model.email;
    this.isActivated = model.isActivated;

    // Optional
    if (model.stores) this.stores = model.stores;
    if (model.sellers) this.sellers = model.sellers;
    if (model.customerStoreId) this.customerStoreId = model.customerStoreId;
    if (model.likedProducts) this.likedProducts = model.likedProducts;
    if (model.cartProducts) this.cartProducts = model.cartProducts;
    if (model.orders) this.orders = model.orders;
  }
}
