const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/sweet.controller");

router.post("/", auth, controller.createSweet);
router.get("/", auth, controller.getAllSweets);
router.get("/search", auth, controller.searchSweets);

router.put("/:id", auth, controller.updateSweet);
router.delete("/:id", auth, controller.deleteSweet);

//inventory
router.post("/:id/purchase", auth, controller.purchaseSweet);
router.post("/:id/restock", auth, role("admin"), controller.restockSweet);

module.exports = router;
