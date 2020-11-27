import { Schema, SchemaTypes, model } from "mongoose";

const OrderSchema = new Schema(
  {
    user: { type: SchemaTypes.ObjectId, required: true, ref: "User" },
    orderdItems: [
      {
        name: { type: String, required: true, trim: true },
        quantity: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: String, required: true },
        product: [
          { type: SchemaTypes.ObjectId, ref: "ProductItem", required: true },
        ],
        shippingAddress: {
          address: { type: String, required: true },
          city: { type: String, required: true },
          postalcode: { type: String, required: true },
          country: { type: String, required: true },
        },
        // paymentMethod: {},
      },
    ],
  },
  { timestamps: true }
);

const Order = model("Order", OrderSchema);

export default Order;
