//load 3rd party modules
import chance from "chance";
import moment from "moment";

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
  const name = randomData.word({ length: 6 }),
    description = randomData.sentence(),
    category = randomData.pickone(productCategories),
    vendor = randomData.company(),
    quantity = randomData.integer({ min: 0, max: 3 }),
    price = randomData.floating({ min: 1, max: 500 }),
    photoUrl = randomData.avatar({ fileExtension: "png" }),
    createdAt = randomData.date({ year: 2020 }),
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

const sampleDummyProducts = Array.from({ length: 100 }, generateProductData);
//Note: this data lacks user ref id
export default sampleDummyProducts;
