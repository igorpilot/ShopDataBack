import StoreService from "../service/store-service.js";
import { v1 } from "uuid";
import StoreModel from "../models/store-model.js";
import cloudinary from "../cloudinaryConfig.js";

class StoreController {
  async createStore(req, res) {
    try {
      const { userId, title, description } = req.body;
      const store = await StoreService.createStore(userId, title, description);
      res.json(store);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Сталася помилка при створенні магазину" });
    }
  }

  async deleteStore(req, res) {
    try {
      const { userId, storeId } = req.body;
      const store = await StoreService.deleteStore(userId, storeId);
      res.json(store);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Сталася помилка при видаленні магазину" });
    }
  }

  async getUserStores(req, res) {
    try {
      const { userId } = req.params;
      const stores = await StoreService.getUserStores(userId);
      return res.status(201).json(stores);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async getUserStore(req, res) {
    try {
      const { storeId } = req.params;
      const store = await StoreService.getUserStore(storeId);
      return res.status(201).json(store);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addCategoryOrSupplier(req, res) {
    try {
      const { label, value, storeId } = req.body;
      const updatedStore = await StoreService.addCategoryOrSupplier(
        label,
        value,
        storeId,
      );
      return res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteCategoryOrSupplier(req, res) {
    try {
      const { label, value, storeId } = req.body;
      const updatedStore = await StoreService.deleteCategoryOrSupplier(
        label,
        value,
        storeId,
      );
      return res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async changeCategoryOrSupplier(req, res) {
    try {
      const { title, label, value, storeId } = req.body;
      const updatedStore = await StoreService.changeCategoryOrSupplier(
        title,
        label,
        value,
        storeId,
      );
      return res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addDelivery(req, res) {
    try {
      const { supplierInfo, storeId } = req.body;
      const updatedStore = await StoreService.addDelivery(
        supplierInfo,
        storeId,
      );
      return res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // async uploadImage(req, res) {
  //     try {
  //         if (!req.file) {
  //             return res.status(400).json({ message: "Файл не знайдено" });
  //         }
  //
  //         const result = await cloudinary.uploader.upload(req.file.path, {
  //             folder: "products",
  //             transformation: [
  //                 {width: 1000, crop: "scale"},
  //                 {quality: "auto"},
  //                 {fetch_format: "auto"}
  //             ],
  //         });
  //
  //         return res.json({ url: result.secure_url });
  //     } catch (error) {
  //         console.error("❌ Помилка завантаження зображення:", error);
  //         res.status(500).json({ message: "Помилка завантаження зображення" });
  //     }
  // }
  // async addProduct(req, res) {
  //     try {
  //         const { productPayload } = req.body;
  //         const updatedStore = await StoreService.addProduct(productPayload);
  //         return res.json(updatedStore);
  //     } catch (error) {
  //         console.error("❌ Помилка в addProduct():", error);
  //         res.status(400).json({ message: error.message });
  //     }
  // }
  async addProduct(req, res) {
    try {
      const { storeId, deliveryId, ...productData } = req.body;
      const file = req.file;
      const store = await StoreService.addProduct({
        storeId,
        deliveryId,
        productData,
        file,
      });

      return res.status(200).json({ store });
    } catch (error) {
      console.error("Error in addProduct:", error);
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to add product";
      return res.status(statusCode).json({ message });
    }
  }

  async addCustomer(req, res) {
    try {
      const { customerInfo, storeId } = req.body;
      const updatedStore = await StoreService.addCustomer(
        customerInfo,
        storeId,
      );
      return res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addSalesProduct(req, res) {
    try {
      const { newProduct, storeId, customerId } = req.body;
      const updatedStore = await StoreService.addSalesProduct(
        newProduct,
        storeId,
        customerId,
      );
      return res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async changeProduct(req, res) {
    try {
      const { storeId, deliveryId, customerId, history, ...productData } =
        req.body;
      const file = req.file;
      const updatedStore = await StoreService.changeProduct({
        storeId,
        deliveryId,
        customerId,
        productData,
        history: history ? JSON.parse(history) : {},
        file,
      });
      return res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { productData, history, storeId, deliveryId, customerId } =
        req.body;
      const updatedStore = await StoreService.deleteProduct(
        productData,
        history,
        storeId,
        deliveryId,
        customerId,
      );
      return res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async changeNumberOfOrder(req, res) {
    try {
      const { value, storeId } = req.body;
      const updatedStore = await StoreService.changeNumberOfOrder(
        value,
        storeId,
      );
      return res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async changeStoreCurrency(req, res) {
    try {
      const { value, storeId } = req.body;
      const updatedStore = await StoreService.changeStoreCurrency(
        value,
        storeId,
      );
      return res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async changeTitleOrDescriptionStore(req, res) {
    try {
      const { title, value, storeId } = req.body;
      const updatedStore = await StoreService.changeTitleOrDescriptionStore(
        title,
        value,
        storeId,
      );
      return res.json(updatedStore);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new StoreController();
