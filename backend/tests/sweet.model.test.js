const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let Sweet;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  Sweet = require("../models/Sweet");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Sweet Model", () => {
  it("should create a sweet with valid fields", async () => {
    const sweet = await Sweet.create({
      name: "Gulab Jamun",
      category: "Indian",
      price: 10,
      quantity: 50,
    });

    expect(sweet._id).toBeDefined();
    expect(sweet.quantity).toBe(50);
  });

  it("should reject negative price or quantity", async () => {
    await expect(
      Sweet.create({
        name: "Bad Sweet",
        category: "Test",
        price: -5,
        quantity: -1,
      })
    ).rejects.toThrow();
  });

  it("should require mandatory fields", async () => {
    await expect(Sweet.create({ name: "Incomplete" })).rejects.toThrow();
  });
});
