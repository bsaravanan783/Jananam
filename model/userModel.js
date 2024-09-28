const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createUser = async (userData) => {
  return await prisma.User.create({
    data: {
      name: userData.username,
      email: userData.email,
      gender: userData.gender,
    },
  });
};

const getAllUsers = async () => {
  return await prisma.User.findMany();
};

const getUserById = async (userId) => {
  return await prisma.User.findUnique({
    where: {
      user_id: userId,
    },
  });
};

const findUserByEmail = async (email) => {
  console.log(email);
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  return user;
};

module.exports = { createUser, findUserByEmail, getUserById, getAllUsers };
