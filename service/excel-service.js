import ExcelJS from "exceljs";
import StoreModel from "../models/store-model.js";

class ExcelService {
  #styles = {
    header: {
      font: { bold: true, size: 12, color: { argb: "FFFFFFFF" } },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4CAF50" },
      },
      alignment: { horizontal: "center", vertical: "middle" },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    },
    cell: {
      alignment: { horizontal: "left", vertical: "middle" },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    },
    total: {
      font: { bold: true, size: 12 },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF0F0F0" },
      },
      alignment: { horizontal: "right", vertical: "middle" },
    },
    groupHeader: {
      font: { bold: true, size: 12, color: { argb: "FF000000" } },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      },
      alignment: { horizontal: "left", vertical: "middle" },
    },
  };

  #inventoryConfig = {
    sheetName: "Склад",
    title: "Прайс-лист складу",
    columns: [
      { header: "ID", key: "id", width: 5 },
      { header: "Фото", key: "image", width: 5 },
      { header: "Онлайн", key: "isOnline", width: 10 },
      { header: "Категорія", key: "category", width: 15 },
      { header: "Назва", key: "name", width: 25 },
      { header: "Опис", key: "description", width: 30 },
      { header: "Бренд", key: "brand", width: 15 },
      { header: "Країна", key: "country", width: 15 },
      { header: "Кількість", key: "quantity", width: 12 },
      {
        header: "Ціна закупки",
        key: "purchasePrice",
        width: 15,
        style: { numFmt: "#,##0.00" },
      },
      {
        header: "Сума закупки",
        key: "purchaseTotal",
        width: 15,
        style: { numFmt: "#,##0.00" },
      },
      {
        header: "Націнка",
        key: "profitPrice",
        width: 12,
        style: { numFmt: "#,##0.00" },
      },
      {
        header: "Ціна продажу",
        key: "sellingPrice",
        width: 15,
        style: { numFmt: "#,##0.00" },
      },
      { header: "Штрих-код", key: "code", width: 15 },
    ],
    isHierarchical: false,
  };

  #supplyConfig = {
    sheetName: "Прихід",
    title: "Звіт про прихід товарів",
    groupColumns: [
      { header: "ID", key: "id", width: 5 },
      { header: "Постачальник", key: "delivery", width: 20 },
      { header: "Номер накладної", key: "numberOfDocument", width: 20 },
      {
        header: "Дата",
        key: "date",
        width: 15,
        style: { numFmt: "dd.mm.yyyy" },
      },
      { header: "Сума", key: "price", width: 20 },
    ],
    itemColumns: [
      { header: "ID", key: "id", width: 5 },
      { header: "Фото", key: "image", width: 5 },
      { header: "Онлайн", key: "isOnline", width: 10 },
      { header: "Категорія", key: "category", width: 15 },
      { header: "Назва", key: "name", width: 25 },
      { header: "Опис", key: "description", width: 30 },
      { header: "Бренд", key: "brand", width: 15 },
      { header: "Країна", key: "country", width: 15 },
      { header: "Кількість", key: "quantity", width: 12 },
      {
        header: "Ціна закупки",
        key: "purchasePrice",
        width: 15,
        style: { numFmt: "#,##0.00" },
      },
      {
        header: "Сума закупки",
        key: "purchaseTotal",
        width: 15,
        style: { numFmt: "#,##0.00" },
      },
      {
        header: "Націнка",
        key: "profitPrice",
        width: 12,
        style: { numFmt: "#,##0.00" },
      },
      {
        header: "Ціна продажу",
        key: "sellingPrice",
        width: 15,
        style: { numFmt: "#,##0.00" },
      },
      { header: "Штрих-код", key: "code", width: 15 },
    ],
    isHierarchical: true,
    itemsKey: "products",
  };

  // Конфігурація для звіту про продаж
  #salesConfig = {
    sheetName: "Продажі",
    title: "Звіт про продажі",
    groupColumns: [
      { header: "ID", key: "id", width: 5 },
      { header: "Покупець", key: "nameOfCustomer", width: 20 },
      { header: "Номер чеку", key: "numberOfOrder", width: 20 },
      {
        header: "Дата",
        key: "date",
        width: 15,
        style: { numFmt: "dd.mm.yyyy" },
      },
      { header: "Сума", key: "price", width: 20 },
    ],
    itemColumns: [
      { header: "ID", key: "id", width: 5 },
      { header: "Категорія", key: "category", width: 5 },
      { header: "Назва", key: "name", width: 25 },
      { header: "Опис", key: "description", width: 30 },
      { header: "Бренд", key: "brand", width: 15 },
      { header: "Кількість", key: "quantity", width: 12 },
      {
        header: "Ціна закупки",
        key: "purchasePrice",
        width: 15,
        style: { numFmt: "#,##0.00" },
      },
      {
        header: "Націнка",
        key: "profitPrice",
        width: 12,
        style: { numFmt: "#,##0.00" },
      },
      {
        header: "Ціна продажу",
        key: "sellingPrice",
        width: 15,
        style: { numFmt: "#,##0.00" },
      },
      {
        header: "Сума продажу",
        key: "sellingTotal",
        width: 15,
        style: { numFmt: "#,##0.00" },
      },
      { header: "Штрих-код", key: "code", width: 15 },
    ],
    isHierarchical: true,
    itemsKey: "products",
  };
  async #createExcel(data, config, metadata = {}) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Inventory System";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(config.sheetName || "Звіт");

    // Додавання заголовку
    worksheet.addRow([config.title || "Звіт"]).getCell(1).font = {
      size: 16,
      bold: true,
    };
    worksheet
      .addRow([`Магазин: ${metadata.title || "Невідомий магазин"}`])
      .getCell(1).font = { size: 12, italic: true };
    worksheet
      .addRow([`Дата: ${new Date().toLocaleDateString("uk-UA")}`])
      .getCell(1).font = { size: 12 };
    worksheet.addRow([]);

    // Налаштування колонок
    const columns = config.isHierarchical
      ? [...config.groupColumns, ...config.itemColumns]
      : config.columns;
    const headerRow = worksheet.addRow(columns.map((col) => col.header));
    headerRow.eachCell((cell) => {
      cell.style = this.#styles.header;
    });

    columns.forEach((col, index) => {
      const column = worksheet.getColumn(index + 1);
      column.width = col.width || 15;
      if (col.style) column.style = col.style;
    });

    // Додавання даних
    if (config.isHierarchical) {
      data.forEach((group) => {
        const groupRow = worksheet.addRow([
          ...config.groupColumns.map((col) => group[col.key]),
          ...Array(config.itemColumns.length).fill(""),
        ]);
        groupRow.eachCell((cell) => {
          cell.style = this.#styles.groupHeader;
        });

        const startRow = worksheet.lastRow.number;
        group[config.itemsKey].forEach((item) => {
          const rowData = [
            ...Array(config.groupColumns.length).fill(""),
            ...config.itemColumns.map((col) => item[col.key]),
          ];
          const itemRow = worksheet.addRow(rowData);
          itemRow.eachCell((cell) => {
            cell.style = this.#styles.cell;
          });
        });

        const endRow = worksheet.lastRow.number;
        for (let i = startRow + 1; i <= endRow; i++) {
          worksheet.getRow(i).outlineLevel = 1;
        }
      });
    } else {
      data.forEach((row) => {
        const rowData = config.columns.map((col) => {
          if (col.key === "date" && row.date) {
            return new Date(row.date).toISOString().split("T")[0];
          }
          if (col.key === "type") {
            return row.type === "customerOrder"
              ? "Замовлення клієнта"
              : row.type === "delivery"
                ? "Поставка"
                : "";
          }
          if (col.key === "products") {
            return row.products
              ? row.products.map((product) => product.name).join(", ")
              : "";
          }
          if (col.key === "price" && row.price) {
            return `${row.price} ${metadata.currency || ""}`;
          }
          return row[col.key] || "";
        });
        const excelRow = worksheet.addRow(rowData);
        excelRow.eachCell((cell) => {
          cell.style = this.#styles.cell;
        });
      });
    }

    // Додавання підсумкових рядків
    const sumKey = config.isHierarchical
      ? config.itemColumns.find(
          (col) => col.key === "price" || col.key === "sellingPrice",
        )?.key
      : "price";
    if (sumKey && !config.isHierarchical) {
      const priceDelivery = data
        .filter((row) => row.type === "arrival")
        .reduce((sum, row) => sum + (row.price || 0), 0);
      const priceCustomer = data
        .filter((row) => row.type === "sales")
        .reduce((sum, row) => sum + (row.price || 0), 0);
      const difference = priceCustomer - priceDelivery;

      // Додавання суми поставок
      const deliveryRow = worksheet.addRow([
        ...Array(columns.length - 2).fill(""),
        "Загальні поставки",
        priceDelivery,
      ]);
      deliveryRow.eachCell((cell, colNumber) => {
        if (colNumber > columns.length - 2) {
          cell.style = this.#styles.total;
          cell.numFmt = "#,##0.00";
        }
      });

      // Додавання суми продажів
      const customerRow = worksheet.addRow([
        ...Array(columns.length - 2).fill(""),
        "Загальні продажі",
        priceCustomer,
      ]);
      customerRow.eachCell((cell, colNumber) => {
        if (colNumber > columns.length - 2) {
          cell.style = this.#styles.total;
          cell.numFmt = "#,##0.00";
        }
      });

      // Додавання різниці (Прибуток/Збитки)
      const differenceRow = worksheet.addRow([
        ...Array(columns.length - 2).fill(""),
        difference >= 0 ? "Прибуток" : "Збитки",
        Math.abs(difference),
      ]);
      differenceRow.eachCell((cell, colNumber) => {
        if (colNumber > columns.length - 2) {
          cell.style = {
            ...this.#styles.total,
            fill: {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: difference >= 0 ? "FF4CAF50" : "FFFF0000" },
            },
          };
          cell.numFmt = "#,##0.00";
        }
      });
    }

    // Умовне форматування для низького запасу (для складу)
    if (!config.isHierarchical && config.sheetName !== "Звіт") {
      worksheet.addConditionalFormatting({
        ref: `I2:I${worksheet.lastRow.number - 3}`,
        rules: [
          {
            type: "cellIs",
            operator: "lessThan",
            formulae: ["10"],
            style: {
              fill: {
                type: "pattern",
                pattern: "solid",
                bgColor: { argb: "FFFF0000" },
              },
            },
          },
        ],
      });
    }

    return await workbook.xlsx.writeBuffer();
  }

  async exportInventory(storeId) {
    try {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      return await this.#createExcel(
        store.rowsAll,
        this.#inventoryConfig,
        store,
      );
    } catch (e) {
      console.error("❌ Помилка в exportInventory():", e);
      throw new Error(`Помилка при експорті: ${e.message}`);
    }
  }

  async exportSupply(supplyData, storeId = {}) {
    try {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      return await this.#createExcel(supplyData, this.#supplyConfig, store);
    } catch (e) {
      console.error("❌ Помилка в exportSupply():", e);
      throw new Error(`Помилка при експорті звіту: ${e.message}`);
    }
  }

  async exportSales(salesData, storeId = {}) {
    try {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      return await this.#createExcel(salesData, this.#salesConfig, store);
    } catch (e) {
      console.error("❌ Помилка в exportSales():", e);
      throw new Error(`Помилка при експорті звіту: ${e.message}`);
    }
  }
  async exportReport(reportData, storeId = {}) {
    try {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        throw new Error("Магазин не знайдено");
      }
      return await this.#createExcel(reportData, this.#salesConfig, store);
    } catch (e) {
      console.error("❌ Помилка в exportSales():", e);
      throw new Error(`Помилка при експорті звіту: ${e.message}`);
    }
  }
}

export default new ExcelService();
