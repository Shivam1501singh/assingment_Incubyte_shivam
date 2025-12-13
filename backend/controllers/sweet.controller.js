const sweetService = require("../services/sweet.service");

exports.createSweet = async (req, res,next) => {
  try {
    const sweet = await sweetService.createSweet(req.body);
    res.status(201).json(sweet);
  } catch (err) {
    next(err);
  }
};

exports.getAllSweets = async (req, res,next) => {
  const sweets = await sweetService.getAllSweets();
  res.json(sweets);
};

exports.updateSweet = async (req, res) => {
  try {
    const sweet = await sweetService.updateSweet(req.params.id, req.body);
    res.json(sweet);
  } catch (err) {
    next(err);
  }
};

exports.deleteSweet = async (req, res,next) => {
  try {
    await sweetService.deleteSweet(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

exports.purchaseSweet = async (req, res,next) => {
  try {
    const { amount = 1 } = req.body;
    const sweet = await sweetService.purchaseSweet(req.params.id, amount);
    res.json(sweet);
  } catch (err) {
    next(err);
  }
};

exports.restockSweet = async (req, res,next) => {
  try {
    const { amount } = req.body;
    const sweet = await sweetService.restockSweet(req.params.id, amount);
    res.json(sweet);
  } catch (err) {
    next(err);
  }
};

exports.searchSweets = async (req, res) => {
  const sweets = await sweetService.searchSweets(req.query);
  res.json(sweets);
};

