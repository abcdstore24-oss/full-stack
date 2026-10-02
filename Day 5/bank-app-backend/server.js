const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let accounts = [];
let transactions = [];

app.post("/accounts", (req, res) => {
  const { name, amount } = req.body;
  console.log(name)
  if(!name){
    return res.status(500).json({
        error: "Please enter a valid name."
    });
  }
  const account = {
    id: accounts.length + 1,
    name: name,
    accountNumber: crypto.randomUUID().replace(/\D/g, "").slice(0, 10),
    balance: Number(amount) || 0,
  };
  accounts.push(account);
  console.log(account);
  res.json(account);
});

app.listen(8000, () => console.log("Server running on port 8000"));
