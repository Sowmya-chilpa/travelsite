const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {

    first_name: {
      type: String,
      required: true,
    },

    last_name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone_number: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    profile_image: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "traveler",
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);