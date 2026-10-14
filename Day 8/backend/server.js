const express = require("express");
const cors = require("cors");
const app = express();

const accountRoutes = require("./routes/accountRoutes")
const transactionRoutes = require("./routes/transactionRoutes")
const transferRoutes = require("./routes/transferRoutes")

app.use(cors());
app.use(express.json());
require("dotenv").config();

app.use("/accounts", accountRoutes)
app.use("/transactions", transactionRoutes)
app.use("/transfer", transferRoutes)


const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
