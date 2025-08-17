const CustomerSchema = new mongoose.Schema({
  id: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String },
  phone: { type: String, required: true },
  email: { type: String },
  city: { type: String },
  warehouse: { type: String },
  registeredAt: { type: Date, default: Date.now },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "OnlineOrder" }],
  notes: { type: String },
});
export default mongoose.model("Customer", CustomerSchema);