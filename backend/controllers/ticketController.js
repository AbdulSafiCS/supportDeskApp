const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");

//get user tickets from api/tickets: private. //get request
const getTickets = asyncHandler(async (req, res) => {
  //get user using JWT and ID
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found!");
  }

  const tickets = await Ticket.find({ user: req.user.id });
  res.status(200).json(tickets);
});
// get user ticket. route: api/tickets/:id
const getTicket = asyncHandler(async (req, res) => {
  //get user using JWT and ID
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found!");
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("ticket not found!");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("not authroized");
  }
  res.status(200).json(ticket);
});

// delete ticket. DELETE /api/tickets/id private

const deleteTicket = asyncHandler(async (req, res) => {
  //get user using JWT and ID
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found!");
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("ticket not found!");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("not authroized");
  }

  await Ticket.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true });
});

// update ticket PUT /api/ticket/id Private
const updateTicket = asyncHandler(async (req, res) => {
  //get user using JWT and ID
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found!");
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("ticket not found!");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("not authroized");
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updatedTicket);
});

//create user ticket from api/post: private. //post request
const createTicket = asyncHandler(async (req, res) => {
  const { product, description } = req.body;
  if (!product || !description) {
    res.status(400);
    throw new Error("product and description fields are required");
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found!");
  }

  const ticket = await Ticket.create({
    product,
    description,
    user: req.user.id,
    status: "new",
  });
  res.status(201).json(ticket);
});

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
};
