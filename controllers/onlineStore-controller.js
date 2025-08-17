import OnlineStoreService from "../service/onlineStore-service.js";

class OnlineStoreController {
  async getStore(req, res) {
    try {
      const { id } = req.params;
      const store = await OnlineStoreService.getStore(id);
      res.json(store);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Сталася помилка controller getStore " });
    }
  }
  async getProduct(req, res) {
    try {
      const { storeId, productId } = req.params;
      const store = await OnlineStoreService.getProduct(storeId, productId);
      res.json(store);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Сталася помилка controller getProduct " });
    }
  }
  async addOnlineOrder(req, res) {
    try {
      const { id } = req.params;
      const { formData } = req.body;
      const response = await OnlineStoreService.addOnlineOrder(id, formData);
      res.json(response);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Сталася помилка controller addOnlineOrder " });
    }
  }
  async getOrders (req, res) {
      try {
        const {userId} = req.params
        const response = await OnlineStoreService.getOrders(userId);
      res.json(response);
      } catch(error) {
        console.error(error);
      res
        .status(500)
        .json({ message: "Сталася помилка controller getOrders" });
      }
    }
    async getOrder (req, res) {
      try {
        const {userId, orderId} = req.params
        const response = await OnlineStoreService.getOrder(userId, orderId);
      res.json(response);
      } catch(error) {
        console.error(error);
      res
        .status(500)
        .json({ message: "Сталася помилка controller getOrders" });
      }
    }
  async saveLikes(req, res, next) {
    try {
      await OnlineStoreService.saveLikes(req.user.id, req.body.likes);
      res.json({ success: true });
    } catch (e) {
      console.error("Помилка при обробці saveLikes:", e);
      next(e);
    }
  }

  async mergeLikes(req, res, next) {
    try {
      await OnlineStoreService.mergeLikes(req.user.id, req.body.likes);
      res.json({ success: true });
    } catch (e) {
      console.error("Помилка при обробці mergeLikes:", e);
      next(e);
    }
  }

  async getLikes(req, res, next) {
    try {
      const likes = await OnlineStoreService.getLikes(req.user.id);
      res.json({ likes });
    } catch (e) {
      console.error("Помилка при обробці getLikes:", e);
      next(e);
    }
  }
  async saveProductsInCart(req, res, next) {
    try {
      await OnlineStoreService.saveProductsInCart(
        req.user.id,
        req.body.products
      );
      res.json({ success: true });
    } catch (e) {
      console.error("Помилка при обробці saveProductsInCart:", e);
      next(e);
    }
  }

  async mergeProductsInCart(req, res, next) {
    try {
      await OnlineStoreService.mergeProductsInCart(
        req.user.id,
        req.body.products
      );
      res.json({ success: true });
    } catch (e) {
      console.error("Помилка при обробці mergeProductsInCart:", e);
      next(e);
    }
  }

  async getProductsInCart(req, res, next) {
    try {
      const products = await OnlineStoreService.getProductsInCart(req.user.id);
      res.json({ products });
    } catch (e) {
      console.error("Помилка при обробці getProductsInCart:", e);
      next(e);
    }
  }
}
export default new OnlineStoreController();
