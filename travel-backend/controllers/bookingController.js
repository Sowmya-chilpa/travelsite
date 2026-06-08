const { createBookingService, getBookingsService,cancelBookingService } = require("../services/bookingService");

const createBooking = async (req, res) => {

  try {
    const booking = await createBookingService(
      req.user.id,
      req.body.packageName,
      req.body.amount,
      req.body.travellers,
      req.body.travelDate,
      req.body.phone,
      req.body.paymentMethod
    );

    res.status(201).json(
      booking
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};

const getBookings = async (req, res) => {

  try {
    const bookings = await getBookingsService(
      req.user.id
    );

    res.status(200).json(
      bookings
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};

const cancelBooking = async (req, res) => {
  try {

    const booking =
      await cancelBookingService(
        req.params.id,
        req.user.id
      );

    res.status(200).json(booking);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  createBooking,
  getBookings,
  cancelBooking
};