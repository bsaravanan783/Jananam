const bayModel = require("../model/bayModel");

const createbay = async (req, res) => {
  try {
    const bayData = req.body;
    const bay = await bayModel.createBay(req.body);
    return res.status(200).json({ bay });
  } catch (error) {
    return res.status(500).json({
      error: "Error occurred in creating a bay",
      details: error.message,
    });
  }
};

const getAllBay = async (req, res) => {
  try {
    const bays = await bayModel.getAllBay();
    return res.status(200).json({ bays });
  } catch (error) {
    return res.status(404).json({
      error: "Error occurred in getting all bays",
      details: error.message,
    });
  }
};

const getBayById = async (req, res) => {
  try {
    const bay = await bayModel.getIndividualBayById(req.params.id);
    return res.status(200).json({ bay });
  } catch (error) {
    return res.status(404).json({
      error: "Error occurred in getting bay by id",
      details: error.message,
    });
  }
};

const getBayByType = async (req, res) => {
  try {
    console.log("kdfmkd")
    const type = req.body.type;
    const bayType = await bayModel.getBayByType(type);
    return res.status(200).json({ bayType });
  } catch (error) {
    return res.status(404).json({
      error: "Error occurred in getting bay by type",
      details: error.message,
    });
  }
};

module.exports = {
  createbay,
  getAllBay,
  getBayById,
  getBayByType,
};
