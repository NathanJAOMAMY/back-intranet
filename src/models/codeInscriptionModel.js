const mongoose = require("mongoose");

const codeInscriptionSchema = new mongoose.Schema(
  {
    id_code: {
      type: String, 
      required: true, 
      unique: true, 
    },
    content_code: {
      type: String,
      default: null,
    },
    status_file: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const codeInscription = mongoose.model("codeInscription", codeInscriptionSchema);

module.exports = codeInscription;

