/* eslint-disable no-undef */
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const { syncUserToMongo } = require('../utils/userSync');
const fileModel = require("../models/files");
const userModel = require("../models/users");
const folderModel = require("../models/folder");
const codeModel = require("../models/codeInscription");
const bcrypt = require("bcrypt");
const uuid = require("uuid").v4; 

let dbPath;

// Vérifie si le code tourne dans Electron
const isElectron = () => {
  return !!(process.versions && process.versions.electron);
};

// Si dans Electron, on va chercher le bon chemin pour stocker la BDD
if (isElectron()) {
  const { app: electronApp } = require("electron");
  const userDataPath = electronApp.getPath("userData");
  dbPath = path.join(userDataPath, "intranet.sqlite");
} else {
  // Sinon, chemin local pour développement classique
  dbPath = path.join(__dirname, "../data/dev.sqlite");
}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false,
});

const Folder = folderModel(sequelize, DataTypes);
const Files = fileModel(sequelize, DataTypes);
const User = userModel(sequelize, DataTypes);
const CodeInscription = codeModel(sequelize, DataTypes);

const initDb = () => {
  return sequelize.sync().then(() => {
    // Crée un admin uniquement s'il n'existe pas
    return User.findOne({ where: { userName: "Admin" } }).then((existing) => {
      if (!existing) {
        bcrypt.hash("admin", 10).then((hash) => {
          User.create({
            idUser: uuid(),
            userName: "Admin",
            surname: "Admin",
            roleUser: "admin",
            password: hash,
          }).then(newUser => {
            syncUserToMongo(newUser.idUser);
          });
        });
        bcrypt.hash("0000", 10).then((hash) => {
          User.create({
            idUser: uuid(),
            userName: "Mika",
            surname: "Mika",
            roleUser: "user",
            password: hash,
          }).then(newUser => {
            syncUserToMongo(newUser.idUser);
          });
        });
        bcrypt.hash("0000", 10).then((hash) => {
          User.create({
            idUser: uuid(),
            userName: "Nathan",
            surname: "Nathan",
            roleUser: "user",
            password: hash,
          }).then(newUser => {
            syncUserToMongo(newUser.idUser);
          });
        });
        bcrypt.hash("0000", 10).then((hash) => {
          User.create({
            idUser: uuid(),
            userName: "Ibrahim",
            surname: "Ibrahim",
            roleUser: "user",
            password: hash,
          }).then(newUser => {
            syncUserToMongo(newUser.idUser);
          });
        });
      }
      console.log("Base de données initialisée !");
    });
  });
};

module.exports = {
  initDb,
  Files,
  User,
  Folder,
  sequelize,
  CodeInscription,
};
