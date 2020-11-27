import { async } from "regenerator-runtime";
import { Types } from "mongoose";
import Product from "../models/Product";
import User from "../models/User";
import sampleDummyProducts from "../starterData/productDummyData";
// console.log({ sampleDummyProducts });
/**
 * @desc create a new product
 * @param {*} req
 * @param {*} res
 */
const addNewProduct = async (req, res) => {
  const {
    name,
    description,
    category,
    vendor,
    quantity,
    price,
    photoUrl,
    user,
  } = req.body;
  try {
    const newProduct = new Product({
      name,
      description,
      category,
      vendor,
      quantity,
      price,
      photoUrl,
      user,
    });
    if (newProduct) {
      await newProduct.save();
      console.log({ newProduct });
      return res.status(201).json(newProduct);
    }
    return res.status(400).json({ message: "Unable to Create a Product." });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while Creating a Product.",
      error: error.message,
    });
  }
};
/**
 * @desc find product by id and update
 * @param {*} req
 * @param {*} res
 */
const updateProductById = async (req, res) => {
  const {
    name,
    description,
    category,
    vendor,
    quantity,
    price,
    photoUrl,
    user,
  } = req.body;
  try {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Product Id",
      });
    }
    const product = await Product.findOneAndUpdate(id);
    if (product) {
      product.name = name;
      product.description = description;
      product.category = category;
      product.vendor = vendor;
      product.quantity = quantity;
      product.price = price;
      product.photoUrl = photoUrl;
      product.user = user;
      const updatedProduct = await product.save();
      if (updatedProduct) {
        return res
          .status(200)
          .send({ message: "Product Updated", data: updatedProduct });
      }
    }
    return res.status(500).send({ message: " Error in Updating Product." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * @description find a product by and delete
 *
 * @param {*} req
 * @param {*} res
 */
const deleteProductById = async (req, res) => {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid Product Id",
    });
  }
  try {
    const productToBeDeleted = await Product.findById(id);

    if (productToBeDeleted) {
      await productToBeDeleted.remove();
      res.status(200).json({ message: "Product Deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * @desc find product by id
 * @param {*} req
 * @param {*} res
 */
const findProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Product Id",
      });
    }
    const product = await Product.findById(id);
    if (product) {
      return res.status(200).json(product._doc);
    }
    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *@description get all available products
 * @param {*} req
 * @param {*} res
 * @route /products/?pagenumber=5&pagesize=3
 */
const fetchAllProducts = async (req, res) => {
  const pageNumber = Number(req.query.pagenumber) || 1,
    pageSize = Number(req.query.pagesize) || 10;
  try {
    const products = await Product.find({})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ price: 1 });
    // console.log({ length: products.length });
    if (products) {
      res.status(200).json(products);
    }
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 *@description add multipe products at a time
 * @param {*} req
 * @param {*} res
 */
const addMultipleProducts = async (req, res) => {
  // let products = sampleDummyProducts;
  try {
    //find and assign the first use as admin
    const users = await User.find({});
    //asign the first user as admin
    const adminUserId = users[0]._id;
    users[0].isAdmin = true;
    //modify randomly generated products so that they look created by admin user
    let updatedSampleProduct = sampleDummyProducts.map((product) => {
      return { ...product, user: adminUserId };
    });
    // console.log({ updatedSampleProduct });
    const dummyProducts = await Product.insertMany(updatedSampleProduct);
    if (dummyProducts) return res.status(200).json({ dummyProducts });
  } catch (error) {
    console.log({ message: error.message });
  }
};
/**
 * @description delete all available products in the database
 * @param {*} req
 * @param {*} res
 */
const clearAllProducts = async (req, res) => {
  const currentUser = req.user;
  if (!currentUser.isAdmin) {
    res.status(401).json({ message: "You are not allowed to clear products!" });
  }
  try {
    //clear db collections
    const deletedProducts = await Product.deleteMany();
    if (deletedProducts) return res.status(200).json(deletedProducts);
    res.status(404).json({ message: "Product is empty" });
    //asign the first user as admin
  } catch (error) {
    console.log({ message: error.message });
  }
};
/**
 * expose all product controllers
 */
export {
  addNewProduct,
  updateProductById,
  deleteProductById,
  findProductById,
  fetchAllProducts,
  addMultipleProducts,
  clearAllProducts,
};
