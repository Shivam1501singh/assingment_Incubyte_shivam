const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.JWT_SECRET = "testsecret";

  await mongoose.connect(mongoServer.getUri());

  app = require("../app");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Auth: Register", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("should not allow duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "User One",
      email: "dup@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "User Two",
      email: "dup@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should reject missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "x@y.com" });

    expect(res.statusCode).toBe(400);
  });
});
