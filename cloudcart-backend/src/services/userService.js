const prisma = require('../config/prisma');

exports.getAllUsers = async () => {
  return await prisma.user.findMany();
};

exports.getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};