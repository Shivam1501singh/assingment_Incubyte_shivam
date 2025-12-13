const sweetService = require("../services/sweet.service");

exports.createSweet = async (req, res) => {
  try {
    const sweet = await sweetService.createSweet(req.body);
    res.status(201).json(sweet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllSweets = async (req, res) => {
  const sweets = await sweetService.getAllSweets();
  res.json(sweets);
};

exports.updateSweet = async (req, res) => {
  try {
    const sweet = await sweetService.updateSweet(req.params.id, req.body);
    res.json(sweet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSweet = async (req, res) => {
  try {
    await sweetService.deleteSweet(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
