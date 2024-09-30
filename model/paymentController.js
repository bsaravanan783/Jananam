const { createTransaction } = require("./transactionModel");
const { createTicket, updateTicketStatus } = require("./ticketModel");
const { getIndividualBayById, updateBayAvailability } = require("./bayModel");
const { getUserById,findUserByEmail } = require("./userModel");

const handlePaymentSuccess = async ( paymentData) => {
  try {
    const { mihpayid, txnid, amount, firstname, email, phone, status } =
      paymentData;

    if (status !== "success") {
      throw new Error("Payment was not successful.");
    }

    const userId = await findUserByEmail(email);
     const ticketCount =1
     const bayId =1

    const transaction = await createTransaction({
      userId,
      amount,
      transactionId: txnid,
      status: "SUCCESS",
      mihpayid,
    });

    for (let i = 0; i < ticketCount; i++) {
      const ticket = await createTicket({ userId, bayId, status: "PURCHASED" });
      await updateTicketStatus(ticket.id, "PURCHASED");
    }

    const user = await getUserById(userId);
    console.log(user);

    const bay = await getIndividualBayById(bayId);
    if (bay) {
      await updateBayAvailability(bayId, bay.available - ticketCount);
    }

    return { success: true, transaction };
  } catch (error) {
    console.error("Error handling payment success:", error);
    return { success: false, error: error.message };
  }
};

const handlePaymentFailure = async (paymentData) => {
    try {
        const { mihpayid, txnid, amount, firstname, email, phone, status } = paymentData;

        console.log("Payment failed:", paymentData);

        const user = await findUserByEmail(email);
        if (!user) {
            throw new Error("User not found.");
        }

        await createTransaction({
            userId: user.user_id,
            amount,
            transactionId: txnid,
            status: "FAILURE",
            mihpayid,
        });


        return { success: true };
    } catch (error) {
        console.error("Error handling payment failure:", error);
        return { success: false, error: error.message };
    }
};




// const handlePaymentFailure = 

module.exports = { handlePaymentSuccess, handlePaymentFailure };