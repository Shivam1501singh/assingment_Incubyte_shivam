const Sweet = require("../models/Sweet");
const AppError=require("../utils/AppError");

exports.purchaseSweet = async (sweetId, amount = 1) => {
  const sweet = await Sweet.findById(sweetId);
  if (!sweet) throw new AppError("Sweet not found",400);

  if (sweet.quantity < amount) {
    throw new AppError("Insufficient stock",400);
  }

  sweet.quantity -= amount;
  await sweet.save();
  return sweet;
};

exports.restockSweet = async (sweetId, amount) => {
  if (amount <= 0) throw new AppError("Invalid restock amount",400);

  const sweet = await Sweet.findById(sweetId);
  if (!sweet) throw new AppError("Sweet not found",404);

  sweet.quantity += amount;
  await sweet.save();
  return sweet;
};

exports.createSweet = async (data) => {
  return Sweet.create(data);
};

exports.getAllSweets = async () => {
  return Sweet.find();
};

exports.updateSweet = async (id, updates) => {
  const sweet = await Sweet.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!sweet) throw new AppError("Sweet not found",404);
  return sweet;
};

exports.deleteSweet = async (id) => {
  const sweet = await Sweet.findByIdAndDelete(id);
  if (!sweet) throw new AppError("Sweet not found",404);
};

exports.searchSweets = async (query) => {
  const filter = {};

  if (query.name) {
    filter.$text = { $search: query.name };
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  return Sweet.find(filter);
};
