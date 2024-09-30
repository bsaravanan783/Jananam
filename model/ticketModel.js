const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createTicket = async (userId, bayType, ticketStatus) => {
    const ticket = await prisma.ticket.create({
        data: {
            ticket_status: ticketStatus,
            date: new Date(), 
            user_id: userId,
            bay_type: bayType,
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