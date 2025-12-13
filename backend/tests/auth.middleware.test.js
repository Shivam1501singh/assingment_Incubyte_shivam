const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let app;
let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.JWT_SECRET = "testsecret";

  await mongoose.connect(mongoServer.getUri());
  app = require("../app");

  // Register + login to get token
  await request(app).post("/api/auth/register").send({
    name: "Protected User",
    email: "protected@example.com",
    password: "password123",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "protected@example.com",
    password: "password123",
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("JWT Auth Middleware", () => {
  it("should allow access with valid token", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
  });

  it("should reject request without token", async () => {
    const res = await request(app).get("/api/protected");
    expect(res.statusCode).toBe(401);
  });

  it("should reject invalid token", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
  });
});
