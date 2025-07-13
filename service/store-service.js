import UserModel from "../models/user-model.js";
import StoreModel from "../models/store-model.js";
import mongoose from "mongoose";
import cloudinary from "../cloudinaryConfig.js";
import { v1 } from "uuid";

class StoreService {
  async createStore(userId, title, description) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Невірний формат userId");
      }
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("Користувач не знайдений");
      }

      const newStore = await StoreModel.create({
        userId,
        title,
        description,
        menu: [],
        supplier: [],
        rowsAll: [],
        rowsDelivery: [],
        rowsCustomer: [],
        numberOfOrder: 1000000,
      });
      user.stores.push(newStore);
      await user.save();
      return newStore;
    } catch (error) {
      console.error("❌ Помилка в createStore():", error);
      throw error;
    }
  }

  async deleteStore(userId, storeId) {
    try {
      const store = await StoreModel.findById(storeId);

      if (!store) {
        throw new Error(
          "Магазин не знайдено або у вас немає прав на його видалення",
        );
      }
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("Користувач не знайдений");
      }
      await StoreModel.findByIdAndDelete(storeId);
      user.stores = user.stores.filter((store) => !store._id.equals(storeId));
      await user.save();
    } catch (error) {
      console.log("❌ Помилка в deleteStore():", error);
    }
  }

  async getUserStores(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Невірний формат userId");
      }
      const user = await UserModel.findById(userId);
      const stores = await StoreModel.find({ userId });
      user.stores = stores;
      await user.save();
      return stores;
    } catch (error) {
      console.error("❌ Помилка в getUserStores():", error);
      throw error;
    }
  }
  async getUserStore(storeId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(storeId)) {
        throw new Error("Невірний формат storeId");
      }
      const store = await StoreModel.findById(storeId);
      return store;
    } catch (error) {
      console.error("❌ Помилка в getUserStore():", error);
      throw error;
    }
  }
  async addCategoryOrSupplier(label, value, storeId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(storeId)) {
        throw new Error("Невірний формат storeId");
      }
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      if (label === "Category" || label === "Категорія") {
        store.menu.unshift(value.toUpperCase());
        store.menu.sort();
      } else if (label === "Supplier" || label === "Постачальник") {
        store.supplier.unshift(value.toUpperCase());
        store.supplier.sort();
      } else if (label === "Brand" || label === "Бренд") {
        store.brands.unshift(value.toUpperCase());
        store.brands.sort();
      } else {
        throw new Error("Невідомий тип оновлення");
      }

      await store.save();
      return store;
    } catch (error) {
      console.error("❌ Помилка в addCategoryOrSupplier():", error);
      throw error;
    }
  }

  async deleteCategoryOrSupplier(label, value, storeId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(storeId)) {
        throw new Error("Невірний формат storeId");
      }

      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }

      if (label === "menu") {
        store.menu = store.menu.filter(
          (item) => item.toUpperCase() !== value.toUpperCase(),
        );
      } else if (label === "supplier") {
        store.supplier = store.supplier.filter(
          (item) => item.toUpperCase() !== value.toUpperCase(),
        );
      } else if (label === "brand") {
        store.brands = store.brands.filter(
          (item) => item.toUpperCase() !== value.toUpperCase(),
        );
      } else {
        throw new Error("Невідомий тип оновлення");
      }

      await store.save();
      return store;
    } catch (error) {
      console.error("❌ Помилка в addCategoryOrSupplier():", error);
      throw error;
    }
  }

  async changeCategoryOrSupplier(title, oldValue, newValue, storeId) {
    try {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }

      if (title === "menu") {
        const index = store.menu.findIndex(
          (item) => item.toUpperCase() === oldValue.toUpperCase(),
        );
        if (index === -1) {
          throw new Error("Категорія не знайдена");
        }
        store.menu[index] = newValue.toUpperCase();
        store.markModified("menu");
      } else if (title === "supplier") {
        const index = store.supplier.findIndex(
          (item) => item.toUpperCase() === oldValue.toUpperCase(),
        );
        if (index === -1) {
          throw new Error("Постачальник не знайдений");
        }
        store.supplier[index] = newValue.toUpperCase();
        store.markModified("supplier");
      } else if (title === "brand") {
        const index = store.brands.findIndex(
          (item) => item.toUpperCase() === oldValue.toUpperCase(),
        );
        if (index === -1) {
          throw new Error("Бренд не знайдений");
        }
        store.brands[index] = newValue.toUpperCase();
        store.markModified("brand");
      } else {
        throw new Error("Невідомий тип оновлення");
      }

      await store.save();
      return store;
    } catch (error) {
      console.error("❌ Помилка в changeCategoryOrSupplier():", error);
      throw error;
    }
  }

  async addDelivery(supplierInfo, storeId) {
    try {
      const store = await StoreModel.findById(storeId);
      console.log(storeId, store);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      store.rowsDelivery = [supplierInfo, ...store.rowsDelivery];
      store.markModified("rowsDelivery");
      await store.save();
      return store;
    } catch (e) {
      console.error("❌ Помилка в addDelivery():", e);
      throw error;
    }
  }

  async uploadImageToCloudinary(file) {
    try {
      console.log("uploadImageToCloudinary", file);
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
        transformation: [
          { width: 1000, crop: "scale" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });
      return result.secure_url;
    } catch (error) {
      throw new Error("Failed to upload image to Cloudinary");
    }
  }

  async addProduct({ storeId, deliveryId, productData, file }) {
    try {
      if (!storeId || !deliveryId) {
        // throw new StoreServiceError('storeId and deliveryId are required', 400);
        console.log("storeId and deliveryId are required");
      }
      if (
        !productData.name ||
        !Number.isFinite(productData.quantity) ||
        !Number.isFinite(productData.purchasePrice)
      ) {
        // throw new StoreServiceError('name, quantity, and purchasePrice are required and must be valid', 400);
        console.log(
          "name, quantity, and purchasePrice are required and must be valid",
        );
      }

      // Пошук магазину
      const store = await StoreModel.findById(storeId);
      if (!store) {
        //  throw new StoreServiceError('Store not found', 404);
        console.log("Store not found");
      }

      const rowDelivery = store.rowsDelivery.find(
        (row) => row.id === deliveryId,
      );
      if (!rowDelivery) {
        // throw new StoreServiceError('Delivery not found', 404);
        console.log("Delivery not found");
      }

      let imageUrl = productData.image || null;
      if (file) {
        imageUrl = await this.uploadImageToCloudinary(file);
      }
      const productPayload = {
        ...productData,
        quantity: Number(productData.quantity),
        purchasePrice: Number(productData.purchasePrice),
        image: imageUrl,
        id: productData.id || v1(),
      };

      const existProduct = store.rowsAll.find(
        (p) => p.id === productPayload.id,
      );
      if (!existProduct) {
        rowDelivery.products = [{ ...productPayload }, ...rowDelivery.products];
        store.rowsAll = [{ ...productPayload }, ...store.rowsAll];
      } else {
        Object.assign(existProduct, {
          ...productPayload,
          quantity: existProduct.quantity + Number(productPayload.quantity),
        });
        rowDelivery.products = [
          { ...productPayload, id: existProduct.id },
          ...rowDelivery.products.filter((p) => p.id !== productPayload.id),
        ];
      }

      rowDelivery.price = rowDelivery.products.reduce(
        (sum, row) => sum + row.quantity * row.purchasePrice,
        0,
      );

      await store.save();
      return store;
    } catch (e) {
      console.error("❌ Помилка в addProduct():", e);
      throw new Error("Не вдалося додати товар");
    }
  }

  async addCustomer(customerInfo, storeId) {
    try {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }

      store.rowsCustomer = [customerInfo, ...store.rowsCustomer];
      store.numberOfOrder++;
      store.markModified("rowsCustomer");
      await store.save();
      return store;
    } catch (e) {
      console.error("❌ Помилка в addCustomer():", e);
      throw error;
    }
  }

  async addSalesProduct(newProduct, storeId, customerId) {
    try {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      const rowCustomer = store.rowsCustomer.find(
        (row) => row.id === customerId,
      );
      if (newProduct.id === "") {
        rowCustomer.products = [
          { ...newProduct, id: v1() },
          ...rowCustomer.products,
        ];
        rowCustomer.price = rowCustomer.products.reduce(
          (sum, row) => sum + row.quantity * row.sellingPrice,
          0,
        );
      } else {
        const existProduct = store.rowsAll.find((p) => p.id === newProduct.id);
        rowCustomer.products = [
          { ...newProduct, id: existProduct.id },
          ...rowCustomer.products,
        ];
        rowCustomer.price = rowCustomer.products.reduce(
          (sum, row) => sum + row.quantity * row.sellingPrice,
          0,
        );
        if (existProduct) {
          Object.assign(existProduct, {
            ...newProduct,
            quantity: existProduct.quantity - newProduct.quantity,
          });
        }
      }
      await store.save();
      return store;
    } catch (e) {
      console.error("❌ Помилка в addSalesProduct():", e);
      throw error;
    }
  }

  async changeProduct({
    productData,
    history,
    storeId,
    deliveryId,
    customerId,
    file,
  }) {
    try {
      if (!storeId) {
        // throw new StoreServiceError('storeId is required', 400);
      }
      if (!deliveryId && !customerId) {
        //  throw new StoreServiceError('Either deliveryId or customerId is required', 400);
      }
      if (
        !productData.id ||
        !productData.name ||
        !Number.isFinite(productData.quantity) ||
        !Number.isFinite(productData.purchasePrice)
      ) {
        //throw new StoreServiceError('id, name, quantity, and purchasePrice are required and must be valid', 400);
      }

      // Пошук магазину
      const store = await StoreModel.findById(storeId);
      if (!store) {
        //throw new StoreServiceError('Store not found', 404);
      }

      let productInRowsAll = store.rowsAll.find(
        (row) => row.id === productData.id,
      );
      let imageUrl = productData.image || null;
      if (file) {
        imageUrl = await this.uploadImageToCloudinary(file);
      }

      const productPayload = {
        ...productData,
        quantity: Number(productData.quantity),
        purchasePrice: Number(productData.purchasePrice),
        sellingPrice: productData.sellingPrice
          ? Number(productData.sellingPrice)
          : undefined,
        code: productData.code || undefined,
        image: customerId ? productInRowsAll.image : imageUrl,
        quantityDifference: Number(productData.quantityDifference),
      };
      if (imageUrl === null && productInRowsAll.image && !customerId) {
        productInRowsAll.image = null;
      }
      if (!deliveryId && !customerId) {
        Object.assign(productInRowsAll, productPayload);
        store.markModified("rowsAll");
      }
      // Оновлення в rowsDelivery, якщо є deliveryId
      if (deliveryId) {
        const rowDelivery = store.rowsDelivery.find(
          (row) => row.id === deliveryId,
        );
        if (!rowDelivery) {
          //  throw new StoreServiceError('Delivery not found', 404);
        }
        const product = rowDelivery.products.find(
          (p) => p.id === productPayload.id,
        );
        if (!product) {
          // throw new StoreServiceError('Product not found in delivery', 404);
        }
        Object.assign(product, productPayload);
        productInRowsAll.quantity =
          productInRowsAll.quantity + productPayload.quantityDifference;
        rowDelivery.price = rowDelivery.products.reduce(
          (sum, row) => sum + row.quantity * row.purchasePrice,
          0,
        );
      }
      if (customerId) {
        const rowCustomer = store.rowsCustomer.find(
          (row) => row.id === customerId,
        );
        if (!rowCustomer) {
          // throw new StoreServiceError('Customer not found', 404);
        }
        const product = rowCustomer.products.find(
          (p) => p.id === productPayload.id,
        );
        if (!product) {
          // throw new StoreServiceError('Product not found in customer', 404);
        }
        Object.assign(product, productPayload);
        productInRowsAll.quantity =
          productInRowsAll.quantity - productPayload.quantityDifference;
        rowCustomer.price = rowCustomer.products.reduce(
          (sum, row) => sum + row.quantity * row.sellingPrice,
          0,
        );
      }

      store.rowsHistory = [history, ...store.rowsHistory];

      store.markModified("rowsAll");
      if (deliveryId) store.markModified("rowsDelivery");
      if (customerId) store.markModified("rowsCustomer");

      await store.save();
      return store;
    } catch (e) {
      console.error("❌ Помилка в ProductService.changeProduct():", e);
      throw new Error("Не вдалося оновити товар");
    }
  }

  async deleteProduct(productData, history, storeId, deliveryId, customerId) {
    try {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      let productInRowsAll = store.rowsAll.find((p) => p.id === productData.id);
      if (deliveryId) {
        const deliveryRow = store.rowsDelivery.find(
          (row) => row.id === deliveryId,
        );
        const deliveryProduct = deliveryRow.products.find(
          (p) => p.id === productData.id,
        );
        if (deliveryRow) {
          const updatedProduct = {
            ...productInRowsAll,
            quantity: productInRowsAll.quantity - deliveryProduct.quantity,
          };
          store.rowsAll = store.rowsAll.map((p) =>
            p.id === productData.id ? updatedProduct : p,
          );
          deliveryRow.products = deliveryRow.products.filter(
            (p) => p.id !== productData.id,
          );
        }
        deliveryRow.price = deliveryRow.products.reduce(
          (sum, row) => sum + row.quantity * row.purchasePrice,
          0,
        );
      }
      if (deliveryId === undefined && customerId === undefined) {
        store.rowsAll = store.rowsAll.filter((p) => p.id !== productData.id);
        store.markModified("rowsAll");
      }
      if (customerId) {
        const customerRow = store.rowsCustomer.find(
          (row) => row.id === customerId,
        );
        const customerProduct = customerRow.products.find(
          (p) => p.id === productData.id,
        );
        if (customerRow) {
          const updatedProduct = {
            ...productInRowsAll,
            quantity: productInRowsAll.quantity + customerProduct.quantity,
          };
          store.rowsAll = store.rowsAll.map((p) =>
            p.id === productData.id ? updatedProduct : p,
          );
          customerRow.products = customerRow.products.filter(
            (p) => p.id !== productData.id,
          );
        }
        customerRow.price = customerRow.products.reduce(
          (sum, row) => sum + row.quantity * row.sellingPrice,
          0,
        );
      }
      store.rowsHistory = [history, ...store.rowsHistory];
      await store.save();
      return store;
    } catch (e) {
      console.log("❌ Помилка в deleteProduct():", e);
      throw Error;
    }
  }

  async changeNumberOfOrder(value, storeId) {
    try {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      store.numberOfOrder = value;
      await store.save();
      return store;
    } catch (e) {
      console.log("❌ Помилка в changeNumberOfOrder():", e);
      throw error;
    }
  }
  async changeStoreCurrency(value, storeId) {
    try {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      store.currency = value;
      await store.save();
      return store;
    } catch (e) {
      console.log("❌ Помилка в changeNumberOfOrder():", e);
      throw error;
    }
  }
  async changeTitleOrDescriptionStore(title, value, storeId) {
    try {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      if (title === "titleOfStore") {
        store.title = value;
      }
      if (title === "descriptionOfStore") {
        store.description = value;
      }
      await store.save();
      return store;
    } catch (e) {
      console.log("❌ Помилка в changeTitleOrDescriptionStore():", e);
      throw error;
    }
  }
}

export default new StoreService();
