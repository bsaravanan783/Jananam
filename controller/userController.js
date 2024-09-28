const userModel = require("../model/userModel");
const createuser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await userModel.createUser(userData);
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({
      error: "Error occurred in creating a user",
      details: error.message,
    });
  }
};

const getAllUSers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      error: "Error occurred in fetching all users",
      details: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      error: "Error occurred in fetching user by id",
      details: error.message,
    });
  }
};

const findUserByEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      error: "Error occurred in fetching user by email",
      details: error.message,
    });
  }
};


export {createuser,findUserByEmail,getAllUSers,getUserById};
