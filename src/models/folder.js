/* eslint-disable no-undef */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('folder', {
        id_folder: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // Assuming you want auto-incrementing IDs
        },
        libelle_folder: {
            type: DataTypes.STRING(50),
            allowNull: true // Assuming this field can be null
        },
        status_folder: {
            type: DataTypes.INTEGER,
            defaultValue : 1,
            allowNull: true // Assuming this field can be null
        }
    }, {
        timestamps: true // Assuming you don't want createdAt and updatedAt fields
    });
}
