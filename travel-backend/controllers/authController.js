const { registerService, loginService, forgotPasswordService, resetPasswordService, } = require("../services/authService");

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
    res.status(400).json({
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
    res.status(400).json({
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result =
      await forgotPasswordService(
        req.body.email
      );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result =
      await resetPasswordService(
        req.params.token,
        req.body.password
      );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};