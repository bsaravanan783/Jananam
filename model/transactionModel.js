const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createTransaction = async () => {
  const transaction = await prisma.transaction({
    data: {
      user_id: data.userId,
      amount: data.amount,
      transaction_id: data.transactionId,
      status: data.status,
    },
  });

  console.log(transaction);
  return transaction;
};

module.exports = { createTransaction };
