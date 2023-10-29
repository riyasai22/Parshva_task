# Parshva_task

### Tools 

ReactJs, ExpressJs, NodeJs, MongoDB, Mongoose, Axios

### API
**Summary of the API endpoints and their tasks:** 

**1. GET /api/supplier:**

**Purpose:** Fetch a list of suppliers.

**Logic:** Retrieves a list of suppliers from your MongoDB database.

**2. GET /api/purchase:**

**Purpose:** Fetch purchase orders for a chosen supplier.

**Query Parameter:** supplier specifies the chosen supplier.

**Logic:** Reads data from a CSV file, processes it to match the chosen supplier, and returns the associated purchase orders for that supplier.

**3. POST /api/add:**

**Purpose:** Add a new docket to the database.

**Request Body:** Includes name, startTime, endTime, hoursWorked, ratePerHour, supplier, and purchaseOrder.

**Logic:** Creates a new docket entry in the database with the provided data.

**4. GET /api/dockets:**

**Purpose:** Fetch a list of all dockets.

**Logic:** Retrieves a list of all dockets from your MongoDB database.

**Tasks:**

- /api/supplier and /api/dockets endpoints are straightforward and involve fetching data from the database.
- /api/add allows you to add new dockets to the database, parsing and converting hoursWorked and ratePerHour to numbers before saving.
- /api/purchase requires processing CSV data and returning purchase orders based on the chosen supplier. It also includes checking if the supplier field in the CSV is empty and still collecting purchase orders for that supplier.

### Dockets List View

![image](https://github.com/riyasai22/Parshva_task/assets/80235375/ef6999c1-91d2-4b57-9e83-8ffbbb059740)

### Add Docket

![image](https://github.com/riyasai22/Parshva_task/assets/80235375/db4b8426-e6ac-43fb-ba35-a9e3fdddc545)

### Alerts

![image](https://github.com/riyasai22/Parshva_task/assets/80235375/6b8cf8ee-cfdb-474b-9ad4-3d6557c4654f)

### Docket Popup Workflow

![Group 145](https://github.com/riyasai22/Parshva_task/assets/80235375/ffc5c40b-5ab9-4834-b21d-0270bddc9f31)


