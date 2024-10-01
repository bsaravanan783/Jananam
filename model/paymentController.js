const { createTransaction } = require("./transactionModel");
const { createTicket, updateTicketStatus } = require("./ticketModel");
const { getIndividualBayById, updateBayAvailability } = require("./bayModel");
const { getUserById, findUserByEmail } = require("./userModel");
const transactionModel = require("./transactionModel");

const ticketModel = require("./ticketModel");

const handlePaymentSuccess = async (paymentData) => {
  try {
    // console.log(JSON.stringify(paymentData));

    console.log(paymentData, "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
    const { mihpayid, txnid, amount, firstname, email, phone, status } =
      paymentData;

    if (status === "success") {
      const transactionStatus = "COMPLETED";
      const updatedTransaction = await transactionModel.updateTransaction(
        txnid,
        transactionStatus
      );
      console.log(updatedTransaction, "transaction updated to success ");
    }

    const user = await findUserByEmail(email);
    console.log(email, "snfjnjnjlsnfjfnjfngjfndgjndjfgnfjnjdfn");
    const ticketCount = 1;
    const bayId = 1;

    const data = {
      userId: user.user_id,
      amount,
      txnId: txnid,
      ticketStatus: "PURCHASED",
      bayId,
      mihpayid,
    };

    const ticket = await ticketModel.createTicket(data);

    console.log(ticket, "created ticket");
    // const user = await getUserById(userId);
    // console.log(user);

    const bay = await getIndividualBayById(bayId);
    console.log(bay, "bbbbbbbbbbbbbbbbbbbbbbbbbbb:");

    const updateBayAvailabeSeatCount = await updateBayAvailability(
      bayId,
      bay.available
    );

    console.log(updateBayAvailabeSeatCount, `new availability of bay ${bayId}`);

    // if (bay) {
    //   await updateBayAvailability(bayId, bay.available - ticketCount);
    // }

    return { success: true };
  } catch (error) {
    console.error("Error handling payment success:", error);
    return { success: false, error: error.message };
  }
};

const handlePaymentFailure = async (paymentData) => {
  try {
    const { mihpayid, txnid, amount, firstname, email, phone, status } =
      paymentData;

    console.log("Payment failed:", paymentData);

    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("User not found.");
    }
    if (status == "failure") {
      const transactionStatus = "CANCELED";
      const updatedTransactionForFailure =
        await transactionModel.updateTransaction(txnid, transactionStatus);

      console.log(
        updatedTransactionForFailure,
        "transaction updated to failure "
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error handling payment failure:", error);
    return { success: false, error: error.message };
  }
};

// const handlePaymentFailure =

module.exports = { handlePaymentSuccess, handlePaymentFailure };
