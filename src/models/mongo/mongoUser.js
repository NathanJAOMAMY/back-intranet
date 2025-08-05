const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  idUser: { type: String, required: true, unique: true },
  userName: String,
  surname: { type: String, required: true },
  roleUser: { type: String, required: true },
  statusUser: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);