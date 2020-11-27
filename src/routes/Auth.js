import express from "express";
import {
  isAuthenticated,
  validateUserSignupInput,
  validateUserSigninInput,
} from "../middleware/utils";
import {
  signup,
  signin,
  signout,
  updateUserByID,
  createAdmin,
} from "../controllers/Auth";

const authRouter = express.Router();

authRouter.post("/signup", validateUserSignupInput(), signup);
authRouter.post("/login", validateUserSigninInput(), signin); //add signin validation middleware
authRouter.get("/signout", signout);
authRouter.put("/:id", isAuthenticated, updateUserByID);
authRouter.get("/createadmin", isAuthenticated, createAdmin);

export default authRouter;
