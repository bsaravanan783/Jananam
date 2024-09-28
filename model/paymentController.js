const { createTransaction } = require('./transactionModel');  
const { createTicket, updateTicketStatus } = require('./ticketModel'); 
const { getIndividualBayById, updateBayAvailability } = require('./bayModel'); 
const { getUserById } = require('./userModel');
const handlePaymentSuccess = async (paymentData) => {
    try {
        const { userId, ticketCount, bayId, amount, transactionId } = paymentData;

        const transaction = await createTransaction({
            userId,
            amount,
            transactionId,
            status: 'SUCCESS',
        });

        for (let i = 0; i < ticketCount; i++) {
            const ticket = await createTicket({ userId, bayId, status: 'PURCHASED' });
            await updateTicketStatus(ticket.id, 'PURCHASED');
        }

        const user = await getUserById(userId);
        if (user) {
            
        }

        const bay = await getIndividualBayById(bayId);
        if (bay) {
            const updatedBay = await updateBayAvailability(bayId, bay.available - ticketCount);
        }

        return { success: true, transaction };
    } catch (error) {
        console.error("Error handling payment success:", error);
        return { success: false, error: error.message };
    }
};

module.exports = { handlePaymentSuccess };