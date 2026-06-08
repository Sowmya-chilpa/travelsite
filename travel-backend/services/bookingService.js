const Booking = require("../models/Booking");

const createBookingService = async (userId, packageName, amount, travellers, travelDate, phone, paymentMethod) => {

  const existingBooking = await Booking.findOne({
    userId,
    packageName,
    travelDate,
  });

  if (existingBooking) {
    throw new Error(
      "You have already booked this package for the selected date"
    );
  }

  const booking = await Booking.create({
      userId,
      packageName,
      amount,
      travellers,
      travelDate,
      phone,
      paymentMethod
    });

  return booking;
};

const getBookingsService = async (userId) => {

  const bookings =await Booking.find({
      userId,
    }).sort({
      createdAt: -1,
    });

  return bookings;
};

const cancelBookingService =
    async (bookingId, userId) => {

        const booking =
            await Booking.findOne({
                _id: bookingId,
                userId,
            });

        if (!booking) {
            throw new Error(
                "Booking not found"
            );
        }

        booking.status =
            "Cancelled";

        await booking.save();

        return booking;
    };

module.exports = {
  createBookingService,
  getBookingsService,
  cancelBookingService 
};