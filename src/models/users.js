/* eslint-disable no-undef */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      idUser: {
        type: DataTypes.STRING, // faire le uuid() du front end
        primaryKey: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pseudo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      statusUser: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      roleUser: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true, // pour le createdAt and updatedAt dans le document
    }
  );
};
