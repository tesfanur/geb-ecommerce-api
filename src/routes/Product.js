import express from "express";
import {
  fetchAllProducts,
  updateProductById,
  deleteProductById,
  addNewProduct,
  findProductById,
  addMultipleProducts,
  clearAllProducts,
} from "../controllers/Product";
import { isAuthenticated, isAdmin } from "../middleware/utils";

const productRouter = express.Router();
//TODO.protect routes with jwt
//product routes
productRouter.post("/create", isAuthenticated, isAdmin, addNewProduct);
productRouter.put("/:id", isAuthenticated, isAdmin, updateProductById);
productRouter.delete("/:id", isAuthenticated, isAdmin, deleteProductById);
productRouter.get("/:id", isAuthenticated, findProductById);
productRouter.get("/", isAuthenticated, fetchAllProducts);
productRouter.post(
  "/addmultipleproducts",
  isAuthenticated,
  isAdmin,
  addMultipleProducts
);
productRouter.get(
  "/clearAllProducts",
  isAuthenticated,
  isAdmin,
  clearAllProducts
);

export default productRouter;
