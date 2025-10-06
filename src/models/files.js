const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    fileName: { type: String, maxlength: 255, default: null },
    originalName: { type: String, maxlength: 255, required: true },
    sizeFile: { type: Number, required: true }, // en bytes
    typeFile: { type: String, maxlength: 50, required: true },
    mimeType: { type: String, maxlength: 100 },
    url: { type: String, required: true },
    readCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
    folderId: { type: String, default: null },
    userId: { type: String, required: true },
    userIdAcces: { type: [String], default: [] },
    departementAcces: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
