import mongoose from "mongoose";

const RowsAllSchema = new mongoose.Schema({
  id: { type: String, required: true },
  image: { type: String, required: false, default: null },
  isOnline: { type: Boolean, default: true },
  category: { type: String, required: false },
  name: { type: String, required: true },
  description: { type: String, required: false },
  brand: { type: String, required: false },
  country: { type: String, required: false },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  purchaseTotal: { type: Number, required: false },
  profitPrice: { type: Number, required: false },
  sellingPrice: { type: Number, required: false },
  code: { type: String, required: false },
  numberOfDocument: { type: String, required: false },
  delivery: { type: String, required: false },
  date: { type: String, required: false },
});
const RowsArrivalProductSchema = new mongoose.Schema({
  id: { type: String, required: true },
  image: { type: String, required: false, default: null },
  isOnline: { type: Boolean, default: true },
  category: { type: String, required: false },
  name: { type: String, required: true },
  description: { type: String },
  brand: { type: String, required: false },
  country: { type: String, required: false },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  purchaseTotal: { type: Number, required: false },
  profitPrice: { type: Number, required: false },
  sellingPrice: { type: Number, required: false },
  code: { type: String, required: false },
});
const RowsDeliverySchema = new mongoose.Schema({
  id: { type: String, required: true },
  numberOfDocument: { type: String, required: false },
  delivery: { type: String, required: false },
  date: { type: String, required: true },
  price: { type: Number, required: true },
  products: { type: [RowsArrivalProductSchema], default: [] },
});

const RowsSalesSchema = new mongoose.Schema({
  id: { type: String, required: true },
  category: { type: String, required: false },
  name: { type: String, required: true },
  description: { type: String },
  brand: { type: String, required: false },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: false },
  profitPrice: { type: Number, required: false },
  sellingPrice: { type: Number, required: true },
  sellingTotal: { type: Number, required: true },
  code: { type: String, required: false },
});
const RowsCustomerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  nameOfCustomer: { type: String, required: false },
  date: { type: String, required: true },
  price: { type: Number, required: true },
  numberOfOrder: { type: String, required: true },
  products: { type: [RowsSalesSchema], default: [] },
});
const RowsHistorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  date: { type: String, required: true },
  action: { type: String, required: true },
  where: { type: String, required: true },
  product: { type: String, required: true },
  description: { type: String, required: true },
});
const StoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: { type: String, required: true },
  description: { type: String, required: false },
  menu: { type: [String], default: [] },
  brands: { type: [String], default: [] },
  supplier: { type: [String], default: [] },
  rowsAll: { type: [RowsAllSchema], default: [] },
  rowsDelivery: { type: [RowsDeliverySchema], default: [] },
  rowsCustomer: { type: [RowsCustomerSchema], default: [] },
  rowsHistory: { type: [RowsHistorySchema], default: [] },
  numberOfOrder: { type: Number, default: 1000000 },
  currency: { type: String, default: "USD" },
});

export default mongoose.model("Store", StoreSchema);
