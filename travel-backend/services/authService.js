const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const registerService = async ({first_name,last_name,email,phone_number,password,}) => {

  const existingEmail = await User.findOne({email});
  if (existingEmail) {
    throw new Error(
      "User with this email already exists"
    );
  }

  const existingPhone = await User.findOne({phone_number});
  if (existingPhone) {
    throw new Error(
      "User with this phone number already exists"
    );
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(
    password,
    salt
  );

  const user = new User({
    first_name,
    last_name,
    email,
    phone_number,
    password: hashedPassword,
  });
  await user.save();
  return user;
};

const loginService = async ({email,password,}) => {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    throw new Error("Invalid Email");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );
  if (!isMatch) {
    throw new Error("Invalid Password");
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return {
    token,
    user: {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
  };
};

const forgotPasswordService =
  async (email) => {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      throw new Error("User not found");
    }
    const resetToken =
      crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry =
      Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    await sendEmail(
      email,
      "Reset Password",
      `
      <h2>Password Reset</h2>
      <p>
        Click below link to reset password
      </p>
      <a href="${resetLink}">
        Reset Password
      </a>
    `
    );
    return {
      message:
        "Reset link sent to email",
    };
  };

const resetPasswordService =
  async (token, password) => {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      throw new Error(
        "Invalid or expired token"
      );
    }
    const salt =
    await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    return {
      message:
        "Password reset successful",
    };
  };

module.exports = {
  registerService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
};  