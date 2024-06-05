const Hapi = require("@hapi/hapi");
const handler = require("./handler");

const routes = [
  {
    method: "GET",
    path: "/bookings",
    handler: handler.getBookings,
  },
  {
    method: "POST",
    path: "/bookings",
    handler: handler.createBooking,
  },
  {
    method: "POST",
    path: "/register",
    handler: handler.registerUser,
  },
  {
    method: "POST",
    path: "/login",
    handler: handler.loginUser,
  },
];

module.exports = routes;
