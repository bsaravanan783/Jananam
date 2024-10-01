const { PrismaClient } = require("@prisma/client");
const { getUserById, findUserByEmail } = require("./userModel");
const prisma = new PrismaClient();

const createTicket = async (data) => {
  console.log(
    "ticket status: " + data.ticketStatus,
    "userId: " + data.userId,
    "bayType: " + data.bayType
  );
  const mihpayid = data.mihpayid;
  const user = await getUserById(parseInt(data.userId));
  if (!user) {
    throw new Error("User not found");
  }

  const ticket = await prisma.ticket.create({
    data: {
      ticket_status: data.ticketStatus,
      date: new Date(),
      //   user_id: data.userId,
      //   bay_id: data.bayId,
      //   transaction_id: data.txnId,
      User: {
        connect: { user_id: data.userId },
      },
      Bay: {
        connect: { bay_id: data.bayId },
      },
      Transaction: {
        connect: { transaction_id: data.txnId },
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



module.exports = { createTicket, updateTicketStatus,  };
