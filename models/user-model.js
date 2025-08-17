import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: [String],
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    activationLink: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    sellers: [
      {
        _id: mongoose.Types.ObjectId,
        firstName: String,
        lastName: String,
        stores: [
          {
            _id: mongoose.Schema.Types.ObjectId,
            title: String,
            description: String,
          },
        ],
      },
    ],
    stores: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        description: String,
      },
    ],
    likedProducts: [],
    cartProducts: [],
    orders: [],
  },
  { timestamps: true },
);

export default mongoose.model("User", UserSchema);
