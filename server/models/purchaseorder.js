const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({
  description: String,
});

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
