const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/sweet.controller");
const { body, query, param } = require("express-validator");
const validate = require("../middleware/validate.middleware");

router.post("/", auth, body("name").notEmpty(),
  body("category").notEmpty(),
  body("price").isFloat({ min: 0 }),
  body("quantity").isInt({ min: 0 }),
  validate,
     controller.createSweet);

router.get("/", auth, controller.getAllSweets);
router.get("/search", auth, query("minPrice").optional().isFloat({ min: 0 }),
query("maxPrice").optional().isFloat({ min: 0 }),
validate,
controller.searchSweets
);

router.put(
  "/:id",
  auth,
  body().custom((value) => {
    if (Object.keys(value).length === 0) {
      throw new Error("Update data required");
    }
    return true;
  }),
  body("name").optional().notEmpty(),
  body("category").optional().notEmpty(),
  body("price").optional().isFloat({ min: 0 }),
  body("quantity").optional().isInt({ min: 0 }),
  validate,
  controller.updateSweet
);

router.delete("/:id", auth, controller.deleteSweet);

//inventory
router.post(
  "/:id/purchase",
  auth,
  body("amount")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Amount must be >= 1"),
  validate,
  controller.purchaseSweet
);

router.post(
  "/:id/restock",
  auth,
  role("admin"),
  body("amount")
    .isInt({ min: 1 })
    .withMessage("Restock amount must be >= 1"),
  validate,
  controller.restockSweet
);


module.exports = router;
