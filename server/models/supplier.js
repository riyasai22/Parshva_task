const mongoose = require("mongoose");
const supplierSchema = new mongoose.Schema({
    name: String,
  });
  

module.exports = mongoose.model('Supplier', supplierSchema);