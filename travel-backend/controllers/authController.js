const {
  registerService,
  loginService,
} = require("../services/authService");

const registerUser = async (req, res) => {

  try {

    const user = await registerService(
      req.body
    );

    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });

  }  catch (error) {

  console.log(error);

  if (
    error.code === 11000 &&
    error.message.includes("email")
  ) {
    return res.status(400).json({
      message: "User with this email already exists",
    });
  }

  if (
    error.code === 11000 &&
    error.message.includes("phone_number")
  ) {
    return res.status(400).json({
      message: "User with this phone number already exists",
    });
  }

  return res.status(500).json({
    message: "Something went wrong",
  });
}

};

const loginUser = async (req, res) => {

  try {

    const result = await loginService(
      req.body
    );

    res.status(200).json({
      message: "Login Successful",
      ...result,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  registerUser,
  loginUser,
};