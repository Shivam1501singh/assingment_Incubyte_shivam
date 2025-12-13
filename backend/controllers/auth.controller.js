const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    const token = await authService.register(req.body);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    res.status(200).json({ token });
  } catch (err) {
    const status = err.message === "Missing credentials" ? 400 : 401;
    res.status(status).json({ message: err.message });
  }
};