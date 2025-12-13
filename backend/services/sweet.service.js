const Sweet = require("../models/Sweet");

exports.purchaseSweet = async (sweetId, amount = 1) => {
  const sweet = await Sweet.findById(sweetId);
  if (!sweet) throw new Error("Sweet not found");

  if (sweet.quantity < amount) {
    throw new Error("Insufficient stock");
  }

  sweet.quantity -= amount;
  await sweet.save();
  return sweet;
};

exports.restockSweet = async (sweetId, amount) => {
  if (amount <= 0) throw new Error("Invalid restock amount");

  const sweet = await Sweet.findById(sweetId);
  if (!sweet) throw new Error("Sweet not found");

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
  if (!sweet) throw new Error("Sweet not found");
  return sweet;
};

exports.deleteSweet = async (id) => {
  const sweet = await Sweet.findByIdAndDelete(id);
  if (!sweet) throw new Error("Sweet not found");
};