var bookings = require("./../models/booking");
var users = require("./../models/users");
var shows = require("./../models/shows");
const fs = require("fs");
const booking = require("./../models/booking");
const bla = require("../models/booking");
const { forEach } = require("./../models/shows");

// console.log(shows);

// shows.forEach((show) => {
//   console.log("show_id: ", show.id);
// });

// id, seatid, datetime, show_id, user_id, status

// "id": 1,
// "showId": 1,
// "seatId": 1,
// "userId": 1,
// "status": "Created",
// "created_at": "1.1.2020 12:30"

function updateIntoFiles(booking, show_id) {
  bookings.bookings.push(booking);
  show = shows.filter((show) => show.id == show_id);
  delete shows[shows.indexOf(show[0])];
  available = show[0].available;
  delete available[available.indexOf(seat_id)];
  show[0].booked.push(seat_id);
  shows.push(show[0]);
  bookings_fn = "../models/booking.js";
  fs.writeFile(
    bookings_fn,
    "module.exports = " + JSON.stringify(bookings),
    (err) => {
      if (err) {
        console.log(err);
        return { error: err };
      } else {
        console.log("file updated booking");
      }
    }
  );
  fs.writeFile(
    "..models/shows.js",
    "module.exports = " + JSON.stringify(shows),
    (err) => {
      if (err) {
        console.log(err);
        return { error: err };
      } else {
        console.log("file updated shows");
      }
    }
  );
}

function makeUpdatesInFiles(booking, show) {
  delete bookings[bookings.bookings.indexOf(booking)];
  bookings.bookings.push(booking);
  delete shows[shows.indexOf(show)];
  shows.push(show);
  bookings_fn = "../models/booking.js";
  console.log(shows);
  console.log(bookings);
  fs.writeFile(
    bookings_fn,
    "module.exports = " + JSON.stringify(bookings),
    (err) => {
      if (err) {
        console.log(err);
        return { error: err };
      } else {
        console.log("file updated booking");
      }
    }
  );
  fs.writeFile(
    "../models/shows.js",
    "module.exports = " + JSON.stringify(shows),
    (err) => {
      if (err) {
        console.log(err);
        return { error: err };
      } else {
        console.log("file updated shows");
      }
    }
  );
}

module.exports = {
  createBooking: function createBooking(show_id, seat_id, user_id) {
    if (
      users.some((user) => user.id == user_id) &&
      shows.some((show) => show.id == show_id) &&
      shows.some((show) => show.available.includes(seat_id))
    ) {
      booking_id = bookings.bookings.length + 1;
      booking = {
        id: booking_id,
        showId: show_id,
        seatId: seat_id,
        userId: user_id,
        status: "Created",
        created_at: new Date(),
      };
      updateIntoFiles(booking, show_id);
      console.log(bookings);
      return booking;
    } else {
      return { error: { message: "request incorrect" } };
    }
  },
  confirmBooking: function confirmBooking() {},
  updateBooking: function updateBooking(booking_id, seat_id) {
    if (bookings.bookings.some((booking) => booking.id == booking_id)) {
      if (shows.some((show) => show.available.includes(seat_id))) {
        curr_booking = bookings.bookings.filter(
          (curr_booking) => curr_booking.id == booking_id
        )[0];
        show = shows.filter(
          (show) => show != null && show.id == curr_booking.showId
        )[0];
        booked_seats = show.booked;
        available_seats = show.available;
        previous_seat_id = bookings.bookings.filter(
          (booking) => booking.id == booking_id
        )[0].seatId;
        previous_index = booked_seats.indexOf(previous_seat_id);
        current_index = available_seats.indexOf(seat_id);
        available_seats[current_index] = previous_seat_id;
        booked_seats[previous_index] = seat_id;
        show.available = available_seats;
        show.booked = booked_seats;
        curr_booking.seatId = seat_id;
        makeUpdatesInFiles(booking, show);
      } else {
        return { error: "Seat is not available" };
      }
    } else {
      return { error: "Booking id is invalid" };
    }
  },
  deleteBooking: function deleteBooking(booking_id) {
    // verify if booking id is valid
    // delete the booking
    // update the show seats in available and booked lists
    if (bookings.bookings.some((booking) => booking.id == booking_id)) {
      delete bookings[bookings.bookings.indexOf(booking)];
      delete shows[shows.indexOf(show)];
      bookings_fn = "../models/booking.js";
      fs.writeFile(
        bookings_fn,
        "module.exports = " + JSON.stringify(bookings),
        (err) => {
          if (err) {
            console.log(err);
            return { error: err };
          } else {
            console.log("bookign cancalled");
          }
        }
      );
      fs.writeFile(
        "../models/shows.js",
        "module.exports = " + JSON.stringify(shows),
        (err) => {
          if (err) {
            console.log(err);
            return { error: err };
          } else {
            console.log("seat unreserved.");
          }
        }
      );
    }
  },
};
