import { Schema, model } from "mongoose";
import { hash, genSalt, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import validator from "validator";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

/**
 * hash password whenever user updates his password
 */
UserSchema.pre("save", async function hashPassword(next) {
  try {
    // let user = this;
    // console.log({ userFromPreSaveMiddleware: user });
    // only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();
    // generate a salt fpr hashing
    const SALT_ROUND = await genSalt(12);
    // console.log({ SALT_ROUND });
    // hash the password along with our new salt
    const hashedPassword = await hash(this.password, SALT_ROUND);
    // override the plain text password with the hashed one
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
//add methods to the  user schema
UserSchema.methods = {
  /**
   * compare user password matching
   */
  validPassword: async function (password) {
    try {
      const passwordMatches = await compare(password, this.password);
      // if (!passwordMatches)
      //   throw new AuthenticationError("Invalid Password or Username");
      return passwordMatches;
    } catch (error) {
      console.log({ error });
      throw Error(
        `Something went wrong. Try again later please. error: ${error}`
      );
    }
  },
  /**
   *generate user access token
   */
  // generateAccessToken: async function () {
  //   try {
  //     let user = this;
  //     let token = await sign(
  //       { _id: user._id.toHexString(), username: user.username },
  //       process.env.JWT_SECRET
  //     );
  //     if (token) return token;
  //   } catch (error) {
  //     return { message: "Authentication failed!" };
  //   }
  // },
};
/**
 * decode user access token
 */
UserSchema.statics.verifyAccessToken = async function (token) {
  // const user = this;
  // console.log({ tokenFromVerifyAccessToken: token });
  if (!token) return Error("Token Authorization failed!");
  token = token.replace("Bearer ", "");
  let decodedUserInfo = await verify(token, SECRET_KEY);
  // console.log({ userschema: this }, { decodedUserInfo });
  try {
    //TODO modify the code below for token verification
    if (decodedUserInfo) {
      const { email, username } = decodedUserInfo;
      const currentUser = await this.findOne({ username }).exec();
      if (!currentUser) throw Error("Token Authorization failed!");

      // console.log("decodedUserInfo", { ...decodedUserInfo, usertype });
      return decodedUserInfo;
    }
  } catch (error) {
    throw Error("Authentication failed!");
  }
};

const User = model("User", UserSchema);

export default User;
