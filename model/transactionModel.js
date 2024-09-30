const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createTransaction = async (data) => {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        transaction_status: data.status,               
        transaction_amount: parseFloat(data.amount),               
        transaction_identifier: data.transactionId,   
        mode: data.mode || "ONLINE",                   
        date: new Date(),                             
        user: {
          connect: {
              user_id: data.userId,                          
          },
        },
      },
    });

    console.log("Transaction created:", transaction);
    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }
};


module.exports = { createTransaction };
