const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


const createTicket = async()=>{
    const ticket = await prisma.ticket.create({
        data: {
            no_of_tickets,
            ticket_status
        }
    });
    console.log(ticket);
    return ticket;

};

const updateTicketStatus = async(ticketId, status) => {
   const updatedTicket =  await prisma.ticket.update({
        where: {
            id: ticketId
        },
        data: {
            ticket_status: status
        }
    });
    console.log(`Ticket with id ${ticketId} updated to ${status}`);

    return updatedTicket;
}


module.exports =  {createTicket,updateTicketStatus};
