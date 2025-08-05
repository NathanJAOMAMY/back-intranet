/* eslint-disable no-undef */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('code_inscription', {
        id_code: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // Assuming you want auto-incrementing IDs
        },
        content_code: {
            type: DataTypes.STRING(20),
            allowNull: true // Assuming this field can be null
        },
        status_file: {
            type: DataTypes.INTEGER,
            defaultValue : 0,
            allowNull: true // Assuming this field can be null
        }
    }, {
        timestamps: true // Assuming you don't want createdAt and updatedAt fields
    });
}
