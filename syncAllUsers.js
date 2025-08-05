// fichier: scripts/syncAllUsers.js (à lancer une seule fois)
const mongoose = require('mongoose');
const { User } = require('./src/db/sequelize');
const MongoUser = require('./src/models/mongo/mongoUser');

(async () => {
    await mongoose.connect('mongodb://localhost:27017/promabio', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const users = await User.findAll();
  for (const u of users) {
    await MongoUser.findOneAndUpdate(
      { idUser: u.idUser },
      {
        idUser: u.idUser,
        userName: u.userName,
        surName: u.surName,
        roleUser: u.roleUser,
        statusUser: u.statusUser || 1
      },
      { upsert: true, new: true }
    );
  }
  console.log('Tous les utilisateurs SQL ont été copiés dans MongoDB');
  process.exit();
})();