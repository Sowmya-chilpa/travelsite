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

  } catch (error) {

    res.status(500).json({
      message: error.message,
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