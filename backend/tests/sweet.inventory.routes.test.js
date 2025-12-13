const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let app;
let mongoServer;
let userToken;
let adminToken;
let sweetId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.JWT_SECRET = "testsecret";

  await mongoose.connect(mongoServer.getUri());
  app = require("../app");

  // normal user
  await request(app).post("/api/auth/register").send({
    name: "User",
    email: "user@test.com",
    password: "password123",
  });

  const userLogin = await request(app).post("/api/auth/login").send({
    email: "user@test.com",
    password: "password123",
  });

  userToken = userLogin.body.token;

  // admin user (force role via DB update)
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@test.com",
    password: "password123",
  });

  const User = require("../models/User");
  await User.findOneAndUpdate(
    { email: "admin@test.com" },
    { role: "admin" }
  );

  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin@test.com",
    password: "password123",
  });

  adminToken = adminLogin.body.token;

  // create sweet (admin)
  const sweetRes = await request(app)
    .post("/api/sweets")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Rasgulla",
      category: "Indian",
      price: 15,
      quantity: 10,
    });

  sweetId = sweetRes.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Sweet Inventory Routes", () => {
  it("should allow user to purchase sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(8);
  });

  it("should reject restock by non-admin", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 5 });

    expect(res.statusCode).toBe(403);
  });

  it("should allow restock by admin", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(13);
  });
});
