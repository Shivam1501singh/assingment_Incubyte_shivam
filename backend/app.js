const express = require("express");
const errorHandler = require("./middleware/error.middleware");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/protected", require("./routes/protected.routes"));
app.use("/api/sweets", require("./routes/sweet.routes"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use(errorHandler); // ALWAYS LAST

module.exports = app;
