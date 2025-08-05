const { User } = require('../db/sequelize'); // Modèle Sequelize existant
const MongoUser = require('../models/mongo/mongoUser'); // Modèle Mongoose

module.exports.syncUserToMongo = async (idUser) => {
  try {
    const sqlUser = await User.findByPk(idUser);
    if (!sqlUser) throw new Error('User SQLite not found');

    await MongoUser.findOneAndUpdate(
      { idUser: sqlUser.idUser },
      {
        idUser: sqlUser.idUser,
        userName: sqlUser.userName,
        surname: sqlUser.surname,
        roleUser: sqlUser.roleUser,
        statusUser: sqlUser.statusUser || 1
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
};