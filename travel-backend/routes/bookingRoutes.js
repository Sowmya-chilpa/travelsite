const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {createBooking,getBookings, cancelBooking} = require("../controllers/bookingController");

router.post("/create",authMiddleware,createBooking);
router.get("/my-bookings",authMiddleware,getBookings);
router.put("/cancel/:id",authMiddleware,cancelBooking)

module.exports = router;