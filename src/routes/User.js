import express from "express";
const userRouter = express.Router();
import { getUserById } from "../controllers/User";

// userRouter.param("userId", getUserById);

userRouter.get("/:userId", (req, res) => {
  res.json({
    user: req.currentUser,
  });
});

export default userRouter;
