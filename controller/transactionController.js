const transactionModel = require('../model/transactionModel');

const createTransaction = async(){
    
    try {
    const transaction = await transactionModel.createTransaction();
        
    } catch (error) {
        return res.status(500).json({
            error: "Error occurred in creating a transaction",
            details: error.message,
          });
    }

}