import User from "../models/User";
import { generateAuthToken } from "../middleware/utils";

const getUserByID = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (user) {
    req.currentUser = user;
    next();
  } else {
    res.status(400).send({ message: "User Not Found" });
  }
};
/**
 * @description find by id and updated user info
 * @param {*} req
 * @param {*} res
 */
const updateUserByID = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    const { username, email, password } = req.body;

    const updatedUser = await user.save();
    if (updatedUser) {
      res.status(200).json({
        username,
        email,
        password,
        token: generateAuthToken(updatedUser),
      });
    }
  } else {
    res.status(404).send({ message: "User Not Found" });
  }
};

export { getUserByID, updateUserByID };
