import { Router } from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/user-controller.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import StoreController from '../controllers/store-controller.js';
import OnlineStoreController from '../controllers/onlineStore-controller.js';
import ExcelController from '../controllers/excel-controller.js';
import upload from '../middlewares/uploadMiddleware.js';
const router = Router();
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:6, max:32}),
    UserController.registration)
router.post('/login', UserController.login)
router.post('/logout',authMiddleware, UserController.logout)
router.get('/activate/:link', UserController.activate)
router.get('/refresh',  UserController.refresh)
router.post('/forgotPassword', UserController.forgotPassword);
router.post('/resetPassword', UserController.resetPassword);
router.get('/users', authMiddleware,   UserController.getUsers)
router.post("/create",authMiddleware, StoreController.createStore);
router.delete('/deleteStore',  StoreController.deleteStore);
router.post("/addCategoryOrSupplier", StoreController.addCategoryOrSupplier);
router.get('/get-stores/:userId', StoreController.getUserStores);
router.put('/deleteCategoryOrSupplier', StoreController.deleteCategoryOrSupplier)
router.put('/changeCategoryOrSupplier', StoreController.changeCategoryOrSupplier)
router.post('/addDelivery', StoreController.addDelivery)
router.post('/addProduct', upload.single('image'), StoreController.addProduct)
//router.post('/uploadImage', upload.single('image'), StoreController.uploadImage);
//router.post('/addProduct', StoreController.addProduct);
router.post('/addCustomer', StoreController.addCustomer)
router.post('/addSalesProduct', StoreController.addSalesProduct)
router.put('/changeProduct', upload.single('image'),  StoreController.changeProduct)
router.delete('/deleteProduct', StoreController.deleteProduct)
router.put('/changeNumberOfOrder', StoreController.changeNumberOfOrder)
router.put('/changeTitleOrDescriptionStore', StoreController.changeTitleOrDescriptionStore)
router.get('/downloadExcel/:storeId', ExcelController.exportInventory);


router.post('/getStore', OnlineStoreController.getStore)
router.post("/saveLikes", OnlineStoreController.saveLikes);
router.post("/mergeLikes", OnlineStoreController.mergeLikes);
router.get("/getLikes", OnlineStoreController.getLikes);
router.post("/saveProductsInCart", OnlineStoreController.saveProductsInCart);
router.post("/mergeProductsInCart", OnlineStoreController.mergeProductsInCart);
router.get("/getProductsInCart", OnlineStoreController.getProductsInCart);




export default router;