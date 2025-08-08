const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({ 
    id_file: {
        type: String,
        required: true,
        unique: true
    },
    libelle_file: {
        type: String,
        maxlength: 50,
        default: null
    },
    size_file: {
        type: String,
        maxlength: 50,
        required: true
    },
    type_file: {
        type: String,
        maxlength: 50,
        required: true
    },
    url: {
        type: String,
        maxlength: 255,
        required: true
    },
    readed: {
        type: Number,
        default: 0,
        required: true
    },
    status_file: {
        type: Number,
        default: 1
    },
    folder_id: {
        type: String,
        default: null
    }
}, {
    timestamps: true // createdAt and updatedAt fields
}); 
 
module.exports = mongoose.model('File', fileSchema);
