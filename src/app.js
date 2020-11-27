//import 3rd party modules
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

//import local modules
import connectToDB from "./config";
import { userRouter, authRouter, productRouter } from "./routes/";
// import { usersRandomData } from "./starterData";

//initialize environement variables
dotenv.config();
//assign port
const PORT = process.env.PORT; // || 5000;
var corsOptions = {
  origin: "http://localhost",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
//instaniate server app
const app = express();
//connect to db
connectToDB();

//apply global middlewares
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//user auth routes
app.use("/users", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);

//hanndle errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ message: error.message });
});
//launch server app
app.listen(PORT, () => {
  console.log(
    `Ecommerce Server app is running currently at http://localhost:${PORT} in ${process.env.NODE_ENV} mode.`
  );
});
