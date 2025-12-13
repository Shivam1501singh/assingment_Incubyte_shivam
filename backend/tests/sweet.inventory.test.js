const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let Sweet;
let sweetService;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  Sweet = require("../models/Sweet");
  sweetService = require("../services/sweet.service");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Sweet Inventory Logic", () => {
  let sweet;

  beforeEach(async () => {
    await Sweet.deleteMany({});
    sweet = await Sweet.create({
      name: "Ladoo",
      category: "Indian",
      price: 5,
      quantity: 10,
    });
  });

  it("should decrease quantity on purchase", async () => {
    const updated = await sweetService.purchaseSweet(sweet._id, 3);
    expect(updated.quantity).toBe(7);
  });

  it("should not allow purchase if insufficient stock", async () => {
    await expect(
      sweetService.purchaseSweet(sweet._id, 20)
    ).rejects.toThrow();
  });

  it("should increase quantity on restock", async () => {
    const updated = await sweetService.restockSweet(sweet._id, 5);
    expect(updated.quantity).toBe(15);
  });
});
