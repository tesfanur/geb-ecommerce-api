import { Schema, SchemaTypes, model } from "mongoose";

/**
 *
 */
const ProductSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number },
    vendor: { type: String },
    photoUrl: { type: String },
    price: { type: Number, required: true },
    user: { type: SchemaTypes.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const Product = model("Product", ProductSchema);

export default Product;
