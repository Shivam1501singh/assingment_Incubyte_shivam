const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

sweetSchema.index({ name: "text" });
sweetSchema.index({ category: 1 });
sweetSchema.index({ price: 1 });

module.exports = mongoose.model("Sweet", sweetSchema);
