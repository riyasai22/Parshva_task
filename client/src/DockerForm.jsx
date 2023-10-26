import React, { useEffect } from "react";
import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import "./DockerForm.css";

const DockerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    hoursWorked: "",
    ratePerHour: "",
    supplier: "",
    purchaseOrder: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [dockets, setDockets] = useState([]);

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/supplier");
      // console.log(res.data);
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers", err);
    }
  };
  const fetchDockets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dockets");
      setDockets(res.data);
    } catch (err) {
      console.error("Error fetching dockets", err);
    }
  };
  const handleSupplierChange = (e) => {
    const selectedSupplier = e.target.value;
    setFormData({ ...formData, supplier: selectedSupplier });
    fetchPurchaseOrders(selectedSupplier);
  };

  const fetchPurchaseOrders = async () => {
    // Replace this with actual API call to your Express.js back-end
    if (formData.supplier) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/purchase?supplier=${formData.supplier}`
        );
        console.log(res);
        const filteredOrders = res.data.filter((po) => po !== "");
        setPurchaseOrders(filteredOrders);
        console.log(purchaseOrders);
      } catch (err) {
        console.error("Error fetching suppliers", err);
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Prepare the docket data to send to the server
    const newDocket = {
      name: formData.name,
      startTime: formData.startTime,
      endTime: formData.endTime,
      hoursWorked: formData.hoursWorked,
      ratePerHour: formData.ratePerHour,
      supplier: formData.supplier,
      purchaseOrder: formData.purchaseOrder,
    };
    console.log(newDocket);
    axios
      .post("http://localhost:5000/api/add", newDocket)
      .then((response) => {
        console.log("Docket created:", response.data);
        // Optionally, you can reset the form fields after a successful submission
        setFormData({
          name: "",
          startTime: "",
          endTime: "",
          hoursWorked: "",
          ratePerHour: "",
          supplier: "",
          purchaseOrder: "",
        });
        setShowPopup(false);
        fetchDockets();
      })
      .catch((error) => {
        console.error("Error creating docket:", error);
      });
  };

  useEffect(() => {
    fetchSuppliers();
    fetchDockets();
  }, []);
  return (
    <>
      {!showPopup && (
        <p className="add" onClick={() => setShowPopup(true)}>
          Add Docket
        </p>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Hours Worked</th>
            <th>Rate Per Hour</th>
            <th>Supplier</th>
            <th>Purchase Order</th>
          </tr>
        </thead>
        <tbody>
          {dockets.map((docket) => (
            <tr key={docket._id}>
              <td>{docket.name}</td>
              <td>{docket.startTime}</td>
              <td>{docket.endTime}</td>
              <td>{docket.hoursWorked}</td>
              <td>{docket.ratePerHour}</td>
              <td>{docket.supplier}</td>
              <td>{docket.purchaseOrder}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup_container">
          <div className="popup" style={{ padding: "20px" }}>
            <FaTimes className="i" onClick={() => setShowPopup(false)} />

            <div className="docker_form">
              <h2>Create a Docket</h2>
              <form onSubmit={handleFormSubmit}>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label>Start time:</label>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label>End time:</label>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label>No. of hours worked:</label>
                  <input
                    type="text"
                    value={formData.hoursWorked}
                    onChange={(e) =>
                      setFormData({ ...formData, hoursWorked: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label>Rate per hour:</label>
                  <input
                    type="text"
                    value={formData.ratePerHour}
                    onChange={(e) =>
                      setFormData({ ...formData, ratePerHour: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label>Supplier:</label>
                  <select
                    value={formData.supplier}
                    onChange={handleSupplierChange}
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers?.map((supplier) => (
                      <option key={supplier._id} value={supplier.name}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Purchase Order:</label>
                  <select
                    value={formData.purchaseOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purchaseOrder: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Purchase Order</option>
                    {purchaseOrders?.map((po) => (
                      <option key={po} value={po}>
                        {po}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button type="submit">Create Docket</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DockerForm;
