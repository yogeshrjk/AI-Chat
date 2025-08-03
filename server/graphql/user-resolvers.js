const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const user = require("../models/user-model");
const uploadToCloudinary = require("../utils/cloudinary"); // adjust path as needed

const userResolvers = {
  Query: {
    getUser: async (_, { _id }) => {
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error("Invalid user ID");
      }
      const foundUser = await user.findById(_id).lean();
      if (!foundUser) throw new Error("User not found");
      return foundUser;
    },
  },
  Mutation: {
    signup: async (_, args) => {
      const {
        firstName,
        lastName,
        phoneNumber,
        dob,
        email,
        gender,
        password,
        profilePic,
      } = args;

      const existingUser = await user.findOne({ email });
      if (existingUser) throw new Error("User already exists.");

      const hashedPassword = await bcrypt.hash(password, 10);

      let profilePicUrl = null;
      if (args.profilePic) {
        try {
          const result = await uploadToCloudinary(args.profilePic); // base64
          profilePicUrl = result.secure_url;
        } catch (err) {
          console.error("Cloudinary upload failed:", err);
          throw new Error("Image upload failed");
        }
      }

      const newUser = await user.create({
        firstName,
        lastName,
        phoneNumber,
        dob,
        email,
        gender,
        password: hashedPassword,
        profilePic: profilePicUrl,
      });

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return {
        ...newUser._doc,
        token,
      };
    },
    login: async (_, { email, password }) => {
      const foundUser = await user.findOne({ email }).select("+password");

      if (
        !foundUser ||
        !foundUser.password ||
        !(await bcrypt.compare(password, foundUser.password))
      ) {
        throw new Error("Invalid email or password");
      }

      const token = jwt.sign(
        { userId: foundUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      const { password: omitPassword, ...userWithoutPassword } = foundUser._doc;

      return {
        ...userWithoutPassword,
        token,
      };
    },

    changePassword: async (_, { _id, oldPassword, newPassword }) => {
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error("Invalid user ID");
      }

      const foundUser = await user.findById(_id).select("+password");
      if (!foundUser) throw new Error("User not found");

      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        foundUser.password
      );
      if (!isPasswordValid) throw new Error("Old password is incorrect");

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      foundUser.password = hashedPassword;
      await foundUser.save();

      return true;
    },

    updateUser: async (_, args) => {
      const { _id, phoneNumber, dob, email, gender, profilePic } = args;

      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error("Invalid user ID");
      }

      const foundUser = await user.findById(_id);
      if (!foundUser) throw new Error("User not found");

      const updateFields = { phoneNumber, dob, email, gender };
      Object.entries(updateFields).forEach(([key, value]) => {
        if (value !== undefined) foundUser[key] = value;
      });

      if (profilePic) {
        foundUser.profilePic = profilePic; // Assume profilePic is new image URL
      }

      await foundUser.save();
      return foundUser;
    },
  },
};

module.exports = userResolvers;
