const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const app = express();
const port = process.env.PORT || 5000;
const Supplier = require("./models/supplier");
const Docket = require("./models/docket");

// Connect to MongoDB using Mongoose
mongoose.connect(
  "mongodb+srv://unprooby:testunprooby2244@cluster0.jmbhoqf.mongodb.net/docket?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");

  // Use a Set to store unique supplier names
  const uniqueSuppliers = new Set();
  let lastKnownSupplier = null;

  //   fs.createReadStream("./models/data.csv")
  //     .pipe(csv())
  //     .on("data", (row) => {
  //       // Extract the supplier name from each row
  //       const supplierValue = row.Supplier; // Adjust this according to your CSV file's structure

  //       if (supplierValue) {
  //         lastKnownSupplier = supplierValue.split(",")[0].trim();
  //       }
  //       const supplierName = supplierValue
  //         ? supplierValue.split(",")[0].trim()
  //         : lastKnownSupplier;
  //       uniqueSuppliers.add(supplierName);
  //     })
  //     .on("end", () => {
  //       // At this point, uniqueSuppliers contains the unique supplier names
  //       const supplierNamesArray = Array.from(uniqueSuppliers);
  //       supplierNamesArray.forEach((name) => {
  //         const supplier = new Supplier({
  //           name,
  //         });
  //         supplier
  //           .save()
  //           .then(() => {
  //             // Document saved successfully
  //             console.log("Supplier saved");
  //           })
  //           .catch((err) => {
  //             console.error("Error saving supplier:", err);
  //           });
  //       });
  //       console.log("CSV file processing complete.");
  //     });
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Set up routes, middleware, and other configurations here
const docketRoutes = require("./routes/docket");

// Use routes
// app.use("/api", docketRoutes);
app.get("/api/supplier", async (req, res) => {
  // Supplier fetching logic
  try {
    const supp = await Supplier.find();
    // console.log(supp);
    res.json(supp);
  } catch (error) {
    console.error("Error fetching suppliers in route:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/purchase", async (req, res) => {
  const chosenSupplier = req.query.supplier; // Get the chosen supplier from the query parameter
  console.log(chosenSupplier);
  const supplierToPO = {};
  let currentSupplier = null; // Variable to keep track of the current supplier being processed

  fs.createReadStream("./models/data.csv")
    .pipe(csv())
    .on("data", (row) => {
      const supplier = row["Supplier"];
      const poNumber = row["PO Number"];

      if (supplier === chosenSupplier) {
        // If the current supplier matches the chosenSupplier, start collecting PO Numbers
        currentSupplier = chosenSupplier;
        supplierToPO[currentSupplier] = supplierToPO[currentSupplier] || [];
        supplierToPO[currentSupplier].push(poNumber);
      } else if (currentSupplier === chosenSupplier) {
        // If the current supplier is empty or doesn't match, continue collecting PO Numbers
        if (!supplier) {
          supplierToPO[currentSupplier].push(poNumber);
        } else {
          // If a different supplier is found, stop collecting and set currentSupplier to null
          currentSupplier = null;
        }
      }
    })
    .on("end", () => {
      // Filter purchase orders for the chosen supplier
      const purchaseOrders = supplierToPO[chosenSupplier] || [];
      res.json(purchaseOrders);
    });
});

app.post("/api/add", async (req, res) => {
  const { name, startTime, endTime, supplier, purchaseOrder } = req.body;

  const hoursWorked = parseFloat(req.body.hoursWorked);
  const ratePerHour = parseFloat(req.body.ratePerHour);
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
    .then((docket) => res.json(docket))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

app.get("/api/dockets", async (req, res) => {
  try {
    const dockets = await Docket.find();
    res.json(dockets);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => {
  console.log(`Server is running on port ${port}`);
});
