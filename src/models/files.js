/* eslint-disable no-undef */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('files', {
        id_file: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // Assuming you want auto-incrementing IDs
        },
        libelle_file: {
            type: DataTypes.STRING(50),
            allowNull: true // Assuming this field can be null
        },
        size_file: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        type_file: {
            type: DataTypes.STRING(50),
            allowNull: false 
        },
        readed: {
            type: DataTypes.INTEGER,
            defaultValue : 0,
            allowNull: false  
        },
        status_file: {
            type: DataTypes.INTEGER,
            defaultValue : 1,
            allowNull: true // Assuming this field can be null
        },
        folder_id: {
            type: DataTypes.INTEGER,
            defaultValue : null,
            allowNull: true // Assuming this field can be null
        },
        
    }, {
        timestamps: true // Assuming you don't want createdAt and updatedAt fields
    });
}
