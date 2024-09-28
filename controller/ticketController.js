const ticketModel = require("../model/ticketModel");

const createTicket = (req, res) => {
  try {
    const { numberOfTickets, ticketStatus } = req.body;
    const newTicket = ticketModel.createTicket(numberOfTickets, ticketStatus);
    console.log(newTicket);
    return res.status(200).json(newTicket);
  } catch (error) {
    return res.status(500).json({
      error: "Error occurred in creating a ticket",
      details: error.message,
    });
  }
};

const updateTicketStatus = (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const { newStatus } = req.body;
    const updatedTicket = ticketModel.updateTicketStatus(ticketId, newStatus);
    return res.status(200).json(updatedTicket);
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "Error occurred in updating a ticket",
        details: error.message,
      });
  }
};

export {createTicket,updateTicketStatus};
