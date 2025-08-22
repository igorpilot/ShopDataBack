import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    image: { type: String, required:false},
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    activationLink: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    sellers: {
      type: [
        {
          _id: mongoose.Schema.Types.ObjectId,
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
      required: false,
      default: undefined,
    },
    stores: {type:[
      {
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        description: String,
      },
    ], required: false, default: undefined,},
    customerStoreId: {type:String, required:false, default: null},
    likedProducts: { type: Array, required: false, default: undefined },
    cartProducts: { type: Array, required: false, default: undefined },
    orders: { type: Array, required: false, default: undefined },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
