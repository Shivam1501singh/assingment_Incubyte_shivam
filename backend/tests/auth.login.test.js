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

  // create a user first (register route already tested)
  await request(app).post("/api/auth/register").send({
    name: "Login User",
    email: "login@example.com",
    password: "password123",
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Auth: Login", () => {
  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should reject invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@example.com",
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(401);
  });

  it("should reject non-existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nouser@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(401);
  });

  it("should reject missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com" });

    expect(res.statusCode).toBe(400);
  });
});
