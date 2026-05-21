const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const registerService = async ({
  first_name,
  last_name,
  email,
  phone_number,
  password,
}) => {

  const existingEmail = await User.findOne({
    email
  });

  if (existingEmail) {
    throw new Error(
      "User with this email already exists"
    );
  }

  const existingPhone = await User.findOne({
    phone_number
  });

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

const loginService = async ({
  email,
  password,
}) => {


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

module.exports = {
  registerService,
  loginService,
};  