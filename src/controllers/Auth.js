import User from "../models/User";
import { generateAuthToken } from "../middleware/utils";
const { validationResult } = require("express-validator");

const updateUserByID = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    const { name, email, password } = req.body;

    const updatedUser = await user.save();

    res.send({
      _id: updatedUser.id,
      name,
      email,
      password,
      isAdmin: updatedUser.isAdmin,
      token: getToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: "User Not Found" });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  //validate user signup input
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  try {
    const userExists =
      (await User.findOne({ username })) || (await User.findOne({ email }));
    //if user doesn't exist creat new user
    if (!userExists) {
      const user = new User({
        username,
        email,
        password,
      });

      const newUser = await user.save();
      // req.user = newUser;
      return (
        res
          .status(201)
          // .json({ ...newUser._doc, token: generateAuthToken(newUser) });
          .json({ isLoggedIn: true, token: generateAuthToken(newUser) })
      );
    }
    res.status(401).json({ message: "user already exist" });
  } catch (error) {
    res.status(501).json({ message: error.message });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
const signin = async (req, res) => {
  const { email, password } = req.body;
  //validate user signup input
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    //find user by email
    const userFound = await User.findOne({ email });
    console.log({ userFound });
    if (userFound) {
      //check password validity
      if (userFound.validPassword(password)) {
        // console.log({ validPassword: await userFound.validPassword(password) });
        const token = generateAuthToken({
          username: userFound.username,
          email: userFound.email,
        });
        // req.user = userFound;
        //keep the token on res cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        return res.json({
          isLoggedIn: true,
          token,
        });
      }
    } else {
      return res.status(401).send({ message: "Invalid Email or Password." });
    }
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
const signout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signed out successfully" });
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const createAdmin = async (req, res) => {
  try {
    // const sampleAdminUser = {
    //   username: "Tesfanur",
    //   email: "tesfanur@tesfannet.com",
    //   password: "dfhglkuesrdhkjgbv4",
    //   isAdmin: true,
    // };
    const { username, email, password } = req.body;
    const user = new User({ username, email, password, isAdmin: true });
    const userExists =
      (await User.findOne({ username })) || (await User.findOne({ email }));
    if (!userExists) {
      const newUser = await user.save();
      const { username, email } = newUser;
      const token = getAuthToken({ username, email });
      res.send({ username, email, token });
    }
    res.send({ message: "User already exists!" });
  } catch (error) {
    res.send({ message: error.message });
  }
};
/**
 * expose all user auth controllers
 */
export { updateUserByID, signup, signin, signout, createAdmin };
