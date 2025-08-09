
const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    id_folder: {
        type: String,
        required: true,
        unique: true
    },
    libelle_folder: {
        type: String, 
        maxlength: 50,
        default: null
    },
    status_folder: {
        type: Number,
        default: 1
    }
    // Assuming you want to keep the timestamps
}, {
    timestamps: true // createdAt and updatedAt fields
});

module.exports = mongoose.model('Folder', folderSchema);
