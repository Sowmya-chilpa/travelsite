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

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("User already exists");
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