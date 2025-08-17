import ExcelService from "../service/excel-service.js";

class ExcelController {
  async importExcel(req, res) {
    try {
      const storeId = req.params.storeId;
      const file = req.file;
      if (!req.file) return res.status(400).send("No file uploaded");
      const buffer = await ExcelService.importExcel(file, storeId);
      res.send(buffer);
    } catch (error) {
      console.error("❌ Помилка експорту:", error);
      res.status(500).json({ error: "Помилка експорту даних" });
    }
  }
  async exportInventory(req, res) {
    try {
      const storeId = req.params.storeId;
      const buffer = await ExcelService.exportInventory(storeId);
      res.send(buffer);
    } catch (error) {
      console.error("❌ Помилка експорту:", error);
      res.status(500).json({ error: "Помилка експорту даних" });
    }
  }
  async exportSupply(req, res) {
    try {
      const { supplyData, storeId } = req.body;
      const buffer = await ExcelService.exportSupply(supplyData, storeId);
      res.send(buffer);
    } catch (error) {
      console.error("❌ Помилка експорту:", error);
      res.status(500).json({ error: "Помилка експорту даних" });
    }
  }
  async exportSales(req, res) {
    try {
      const { salesData, storeId } = req.body;
      const buffer = await ExcelService.exportSales(salesData, storeId);
      res.send(buffer);
    } catch (error) {
      console.error("❌ Помилка експорту:", error);
      res.status(500).json({ error: "Помилка експорту даних" });
    }
  }
  async exportReport(req, res) {
    try {
      const { reportData, storeId } = req.body;
      const buffer = await ExcelService.exportReport(reportData, storeId);
      res.send(buffer);
    } catch (error) {
      console.error("❌ Помилка експорту:", error);
      res.status(500).json({ error: "Помилка експорту даних" });
    }
  }
}

export default new ExcelController();
