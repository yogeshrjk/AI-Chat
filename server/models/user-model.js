const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: 10,
      maxlength: 13,
    },
    dob: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    gender: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    password: {
      type: String,
      select: false,
      required: function () {
        return !this.googleId;
      },
    },
    profilePic: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
