//load 3rd party modules
import chance from "chance";
import moment from "moment";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
// import { Schema, model } from "mongoose";

//laod local modules
import User from "../models/User";
import Order from "../models/Order";
import Product from "../models/Product";
import connectToDB from "../config";

//load environment variables
dotenv.config();

connectToDB();
//generate started random data for test
const randomData = chance();
const productCategories = [
  "Toys & Games",
  "Electronic Accessories & Gadgets",
  "Camera & Photo Accessories",
  "Video Games",
  "Books",
  "Clothing, Shoes & Jewelry",
  "Beauty And Personal Care",
];

const generateProductData = () => {
  const name = randomData.string(),
    createdAt = randomData.date({ year: 2020 }),
    description = randomData.sentence(),
    category = randomData.pickone(productCategories),
    vendor = randomData.company(),
    quantity = randomData.integer({ min: 0, max: 3 }),
    price = randomData.floating({ min: 1, max: 500 }),
    photoUrl = randomData.avatar({ fileExtension: "png" }),
    updatedAt = new moment(createdAt).add(randomData.minute(), "m").toDate();
  return {
    name,
    description,
    category,
    vendor,
    quantity,
    price,
    photoUrl,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
};
//
const generateUserData = () => {
  const name = randomData.name(),
    createdAt = randomData.date({ year: 2020 }),
    updatedAt = new moment(createdAt).add(randomData.minute(), "m").toDate();
  return {
    // name,
    username: name.replace(" ", ".").toLowerCase(),
    email: randomData.email(),
    password: bcrypt.hashSync(randomData.bb_pin(), 10),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
};
//generate dummy data for test
export const usersRandomData = Array.from({ length: 100 }, generateUserData);
// console.dir(usersRandomData);
export const sampleDummyProducts = Array.from(
  { length: 100 },
  generateProductData
);
// console.log({ products: sampleDummyProducts });
const importData = async () => {
  try {
    //clear db collections
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    //
    const users = await User.insertMany(usersRandomData);
    //asign the first user as admin
    const adminUserId = users[0]._id;
    users[0].isAdmin = true;

    //
    let updatedSampleProduct = sampleDummyProducts.map((product) => {
      return { ...product, user: adminUserId };
    });
    console.log({ updatedSampleProduct });
    const dummyProducts = await Product.insertMany(updatedSampleProduct);
  } catch (error) {
    console.log({ message: error.message });
  }
};

importData();
