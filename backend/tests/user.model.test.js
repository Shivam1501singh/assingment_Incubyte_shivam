const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let User;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  User = require("../models/User");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Model", () => {
  it("should create a user with valid fields", async () => {
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(user._id).toBeDefined();
    expect(user.email).toBe("test@example.com");
    expect(user.role).toBe("user");
  });

  it("should not allow duplicate emails", async () => {
    await User.create({
      name: "User One",
      email: "dup@example.com",
      password: "password123",
    });

    await expect(
      User.create({
        name: "User Two",
        email: "dup@example.com",
        password: "password456",
      })
    ).rejects.toThrow();
  });

  it("should require email and password", async () => {
    await expect(
      User.create({ name: "No Email" })
    ).rejects.toThrow();
  });
});
