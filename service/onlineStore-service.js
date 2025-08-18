import StoreModel from "../models/store-model.js";
import UserModel from "../models/user-model.js";
import { v1 } from "uuid";
class OnlineStoreService {
  async getStore(id) {
    try {
      const store = await StoreModel.findOne({ title: id });

      if (!store) {
        throw new Error("Магазин не знайдено");
      }

      return store;
    } catch (error) {
      console.log("Error in getProducts", error);
      throw error;
    }
  }
  async getProduct(storeId, productId) {
    try {
      const store = await this.getStore(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      const product = store.rowsAll.find((product) => product.id === productId);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      console.log("Error in getProducts", error);
      throw error;
    }
  }
  async addOnlineOrder(id, formData) {
    try {
      const store = await StoreModel.findOne({ title: id });
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      const onlineOrder = {
        ...formData,
        products: formData.products.map((p) => ({
          ...p,
          quantity: p.quantityInCart,
          sellingTotal: p.quantityInCart*p.sellingPrice
        })),
        id: v1(),
        numberOfOrder: store.numberOfOrder,
      };
      store.onlineOrders = [onlineOrder, ...store.onlineOrders];
      store.rowsCustomer = [
        {
          ...onlineOrder,
          online: true,
          nameOfCustomer:
            `${onlineOrder.firstName} ${onlineOrder.lastName}`.trim(),
          price: onlineOrder.priceProducts,
          date: new Date(),
          status: "new",
        },
        ...store.rowsCustomer,
      ];
      store.numberOfOrder++;
      await store.save();
      return onlineOrder;
    } catch (error) {
      console.log("Error in getProducts", error);
      throw error;
    }
  }
  async getOrders (userId) {
    try {
      // const user = await UserModel.findById(userId)
      // if (!user) throw new Error("User not found");
      //return user.orders
      const store = await StoreModel.findOne({ title:  userId });
      return store.onlineOrders
    } catch(error) {
      console.log("Error in getOrders", error);
      throw error;
    }
  }
  async getOrder (userId, orderId) {
    try {
      // const user = await UserModel.findById(userId)
      // if (!user) throw new Error("User not found");
      // const order = user.orders.find(order=>order.id===orderId)
      // if (!order) throw new Error("Order not found");
      // return order
      const store = await StoreModel.findOne({ title: userId });
      return store.onlineOrders.find(o=>o.id===orderId)
    } catch(error) {
      console.log("Error in getOrders", error);
      throw error;
    }
  }
  async saveLikes(userId, likes) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");
    user.customer.likedProducts = likes;
    await user.save();
    return true;
  }

  async mergeLikes(userId, likes) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    const set = new Set([
      ...user.customer.likedProducts.map((id) => id.toString()),
      ...likes,
    ]);
    user.customer.likedProducts = Array.from(set);
    await user.save();
    return true;
  }

  async getLikes(userId) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    return user.customer.likedProducts;
  }
  async saveProductsInCart(userId, products) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");
    user.customer.cartProducts = products;
    await user.save();
    return true;
  }

  async mergeProductsInCart(userId, products) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    const set = new Set([
      ...user.customer.cartProducts.map((id) => id.toString()),
      ...products,
    ]);
    user.customer.cartProducts = Array.from(set);
    await user.save();
    return true;
  }

  async getProductsInCart(userId) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    return user.customer.cartProducts;
  }
}
export default new OnlineStoreService();
