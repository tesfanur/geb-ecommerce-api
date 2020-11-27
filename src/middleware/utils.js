import jwt from "jsonwebtoken";
import { async } from "regenerator-runtime";
import User from "../models/User";
const { check } = require("express-validator");
/**
 * @param {*} email
 * @param {*} username
 */
const generateAuthToken = ({ email, username }) => {
  return jwt.sign({ email, username }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRE_TIME,
  });
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;

  //Bearer
  if (token) {
    //remove Bearer prefix
    const authToken = token.replace("Bearer ", "");

    // jwt.verify(authToken, process.env.JWT_SECRET, (err, decode) => {
    //   if (err) {
    //     return res.status(401).json({ message: "Authentication failed." });
    //   }
    //   //attach user on req object
    //   req.user = decode;
    //   next();
    //   return;
    // });
    const decode = await jwt.verify(authToken, process.env.JWT_SECRET);
    if (decode) {
      req.user = decode;
      const findUser = await User.findOne({ username: req.user.username });
      // console.log({ findUser: findUser });
      const { isAdmin } = findUser;
      req.user.isAdmin = isAdmin;
      // console.log({ reqUser: req.user });
      next();
      return;
    }
  } else {
    return res.status(401).json({ message: "You are not authenticated" });
  }
};

const isAdmin = async (req, res, next) => {
  console.log({ userFromIsAdmin: req.user });
  const findUser = await User.findOne({ email: req.user.email });
  if (req.user && findUser.isAdmin) {
    return next();
  }
  return res.status(401).send({ message: "Admin Token is not valid." });
};
/**
 * @description validates use signup inputs
 */
const validateUserSignupInput = () => {
  const errors = [
    check("username").notEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 8 }),
  ];
  // console.log({ veResult: errors });
  return errors;
};
/**
 * @description validates user signin inputs
 */
const validateUserSigninInput = () => {
  const errors = [
    check("email").isEmail(),
    check("password").isLength({ min: 8 }),
  ];
  // console.log({ veResult: errors });
  return errors;
};

//expose all utilites
export {
  isAdmin,
  isAuthenticated,
  generateAuthToken,
  validateUserSignupInput,
  validateUserSigninInput,
};
