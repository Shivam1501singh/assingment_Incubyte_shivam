const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/sweet.controller");

router.post("/", auth, controller.createSweet);
router.get("/", auth, controller.getAllSweets);
router.put("/:id", auth, controller.updateSweet);
router.delete("/:id", auth, controller.deleteSweet);

module.exports = router;
