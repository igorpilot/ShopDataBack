const OnlineStoreService = require("../service/onlineStore-service");

class OnlineStoreController {
    async getStore(req, res) {
        try {
            const {storeId} = req.body;
            const store = await OnlineStoreService.getStore(storeId);
            res.json(store);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Сталася помилка controller getProducts '});
        }
    }
}
module.exports = new OnlineStoreController();