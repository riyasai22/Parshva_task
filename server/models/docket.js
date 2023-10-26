const mongoose = require("mongoose");
const fs = require("fs");

const csv = require("csv-parser");

const docketSchema = new mongoose.Schema({
  name: String,
  startTime: String,
  endTime: String,
  hoursWorked: Number,
  ratePerHour: Number,
  supplier: String,
  purchaseOrder: String,
});
module.exports = mongoose.model("Docket", docketSchema);
