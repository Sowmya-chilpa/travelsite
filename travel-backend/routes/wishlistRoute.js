
const express = require("express");
const router = express.Router();
const { addItem, removeItem, getItems } = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/authMiddleware")
router.use(authMiddleware);

router.get("/", getItems);
router.post("/", addItem);
router.delete("/:packagetitle", removeItem);

module.exports = router;