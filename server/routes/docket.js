const express = require("express");
const router = express.Router();
const Docket = require("../models/docket");
const Supplier = require("../models/supplier");

// Create a new docket
router.post("/", (req, res) => {
  const {
    name,
    startTime,
    endTime,
    hoursWorked,
    ratePerHour,
    supplier,
    purchaseOrder,
  } = req.body;

  const newDocket = new Docket({
    name,
    startTime,
    endTime,
    hoursWorked,
    ratePerHour,
    supplier,
    purchaseOrder,
  });

  newDocket
    .save()
    .then(() => res.json("Docket added!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.get("/", async (req, res) => {
  try {
    const supp = await Supplier.find();
    console.log(supp);
    res.json(supp);
  } catch (error) {
    console.error("Error fetching suppliers in route:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
