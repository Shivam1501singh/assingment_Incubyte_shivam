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

  // auth
  await request(app).post("/api/auth/register").send({
    name: "Searcher",
    email: "search@test.com",
    password: "password123",
  });

  const login = await request(app).post("/api/auth/login").send({
    email: "search@test.com",
    password: "password123",
  });

  token = login.body.token;

  // seed sweets
  const sweets = [
    { name: "Ladoo", category: "Indian", price: 10, quantity: 20 },
    { name: "Barfi", category: "Indian", price: 25, quantity: 10 },
    { name: "Donut", category: "Western", price: 15, quantity: 30 },
  ];

  for (const s of sweets) {
    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send(s);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Sweet Search API", () => {
  it("should search by name (partial, case-insensitive)", async () => {
    const res = await request(app)
      .get("/api/sweets/search?name=lad")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Ladoo");
  });

  it("should filter by category", async () => {
    const res = await request(app)
      .get("/api/sweets/search?category=Indian")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.length).toBe(2);
  });

  it("should filter by price range", async () => {
    const res = await request(app)
      .get("/api/sweets/search?minPrice=10&maxPrice=20")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.length).toBe(2);
  });
});
