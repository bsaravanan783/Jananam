const { PrismaClient } = require("@prisma/client");
const { getUserById, findUserByEmail } = require("./userModel");
const prisma = new PrismaClient();

const createTicket = async (userId, bayType, ticketStatus) => {
  console.log(
    "ticket status: " + ticketStatus,
    "userId: " + userId,
    "bayType: " + bayType
  );

  const user = await getUserById(parseInt(userId));
  if (!user) {
    throw new Error("User not found");
  }

  const ticket = await prisma.ticket.create({
    data: {
      ticket_status: ticketStatus,
      date: new Date(),
      user_id: user.user_id, 
      bay_id: bayType, 
      User: {
        connect: { user_id: user.user_id }, 
      },
      Bay: {
        connect: { bay_id: bayType },
      },
      Transaction: {
        connect: { transaction_id: txnId },
      },
    },
  });

  console.log(ticket);
  return ticket;
};

const updateTicketStatus = async (ticketId, status) => {
  const updatedTicket = await prisma.ticket.update({
    where: {
      ticket_id: ticketId,
    },
    data: {
      ticket_status: status,
    },
  });
  console.log(`Ticket with id ${ticketId} updated to ${status}`);
  return updatedTicket;
};

module.exports = { createTicket, updateTicketStatus };
