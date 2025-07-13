import { Router } from "express";
import { body } from "express-validator";
import UserController from "../controllers/user-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import StoreController from "../controllers/store-controller.js";
import OnlineStoreController from "../controllers/onlineStore-controller.js";
import ExcelController from "../controllers/excel-controller.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = Router();
router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 32 }),
  UserController.registration,
);
router.post("/login", UserController.login);
router.post("/logout", authMiddleware, UserController.logout);
router.get("/activate/:link", UserController.activate);
router.get("/refresh", UserController.refresh);
router.post("/forgotPassword", UserController.forgotPassword);
router.post("/resetPassword", UserController.resetPassword);
router.get("/users", authMiddleware, UserController.getUsers);
router.post("/create", authMiddleware, StoreController.createStore);
router.delete("/deleteStore", authMiddleware, StoreController.deleteStore);
router.post(
  "/addCategoryOrSupplier",
  authMiddleware,
  StoreController.addCategoryOrSupplier,
);
router.get("/stores/:userId", authMiddleware, StoreController.getUserStores);
router.get("/store/:storeId", authMiddleware, StoreController.getUserStore);
router.put(
  "/deleteCategoryOrSupplier",
  authMiddleware,
  StoreController.deleteCategoryOrSupplier,
);
router.put(
  "/changeCategoryOrSupplier",
  authMiddleware,
  StoreController.changeCategoryOrSupplier,
);
router.post("/addDelivery", authMiddleware, StoreController.addDelivery);
router.post(
  "/addProduct",
  authMiddleware,
  upload.single("image"),
  StoreController.addProduct,
);
router.post("/addCustomer", authMiddleware, StoreController.addCustomer);
router.post(
  "/addSalesProduct",
  authMiddleware,
  StoreController.addSalesProduct,
);
router.put(
  "/changeProduct",
  authMiddleware,
  upload.single("image"),
  StoreController.changeProduct,
);
router.delete("/deleteProduct", authMiddleware, StoreController.deleteProduct);
router.put(
  "/changeNumberOfOrder",
  authMiddleware,
  StoreController.changeNumberOfOrder,
);
router.put(
  "/changeStoreCurrency",
  authMiddleware,
  StoreController.changeStoreCurrency,
);
router.put(
  "/changeTitleOrDescriptionStore",
  authMiddleware,
  StoreController.changeTitleOrDescriptionStore,
);
router.get(
  "/downloadExcel/:storeId",
  authMiddleware,
  ExcelController.exportInventory,
);

router.post("/getStore", OnlineStoreController.getStore);
router.post("/saveLikes", OnlineStoreController.saveLikes);
router.post("/mergeLikes", OnlineStoreController.mergeLikes);
router.get("/getLikes", OnlineStoreController.getLikes);
router.post("/saveProductsInCart", OnlineStoreController.saveProductsInCart);
router.post("/mergeProductsInCart", OnlineStoreController.mergeProductsInCart);
router.get("/getProductsInCart", OnlineStoreController.getProductsInCart);

export default router;
