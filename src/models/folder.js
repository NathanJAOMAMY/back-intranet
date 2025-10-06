const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  parentFolderId: { type: String, default: null }, // pour sous-dossiers
  userId: { type: String, required: true },
  userIdAcces: { type: [String], default: [] },
  departementAcces: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Folder", folderSchema);
