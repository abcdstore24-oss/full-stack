const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let accounts = [{
    id: 1,
    name: 'Pinkey Prasad',
    accountNumber: '8443779412',
    balance: 5000
  }];
let transactions = [];

// Create Account
app.post("/accounts", (req, res) => {
  const { name, amount } = req.body;
  if(!name){
    return res.status(400).json({
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
  res.json(account);
});

// Fetch Account
app.get("/accounts", (req,res)=>{
  res.json(accounts)
})

// Get a Account
app.get("/accounts/:accountNumber", (req, res)=>{
  const accountNumber = req.params.accountNumber
  const account = accounts.find((a)=>a.accountNumber === accountNumber);
  if(!account){
    return res.status(404).json({
      error: "Account Not Found."
    })
  }
  return res.json(account);
})

// Deposit
app.post("/accounts/:accountNumber/deposit", (req, res)=>{
  const accountNumber = req.params.accountNumber;
  const account = accounts.find((a)=>a.accountNumber === accountNumber)
  if(!account){
    return res.status(404).json({
      error: "Account Not Found."
    })
  }
  const amount = Number(req.body.amount);
  if(!amount || amount<=0){
    return res.status(400).json({
      error: "Enter a valid amount."
    })
  }
  account.balance +=amount;
  transactions.push({
    id: transactions.length+1,
    accountNumber: account.accountNumber,
    type: "DEPOSIT",
    amount,
    balanceAfter: account.balance,
    timeStamp: new Date().toISOString(),
  })
  res.json(account)
})

// Withdraw
app.post("/accounts/:accountNumber/withdraw", (req, res)=>{
  const accountNumber = req.params.accountNumber;
  const account = accounts.find((a)=>a.accountNumber === accountNumber)
  if(!account){
    return res.status(404).json({
      error: "Account Not Found."
    })
  }
  const amount = Number(req.body.amount);
  if(!amount || amount<=0){
    return res.status(400).json({
      error: "Enter a valid amount."
    })
  }
  if(amount> account.balance){
    return res.status(500).json({
      error: "Insufficient Balance."
    })
  }
  account.balance -=amount;
  transactions.push({
    id: transactions.length+1,
    accountNumber: account.accountNumber,
    type: "WITHDRAWAL",
    amount,
    balanceAfter: account.balance,
    timeStamp: new Date().toISOString(),
  })
  res.json(account)
})

// Transfer
app.post("/transfer", (req,res) => {
  const {from, to, amountInput} = req.body;
  const amount = Number(amountInput)
  if(!from || !to){
    return res.status(400).json({
      error:"Both accounts are required."
    })
  }
  if(from === to){
    return res.status(400).json({
      error:"Source and Destination must be different."
    })
  }
  if(!amount || amount<=0){
    return res.status(400).json({
      error:"Enter a valid amount."
    })
  }
  const fromAccount = accounts.find((a)=> a.accountNumber === from);
  const toAccount = accounts.find((a)=> a.accountNumber === to);
  if(!fromAccount){
    return res.status(404).json({
      error:"Source Account not found."
    })
  }
  if(!toAccount){
    return res.status(404).json({
      error:"Destination Account not found."
    })
  }
  if(amount > fromAccount.balance){

    return res.status(400).json({
      error:"Insufficient Balance."
    })
  }
  fromAccount.balance -=amount;
  toAccount.balance+=amount;
  transactions.push({
    id: transactions.length+1,
    accountNumber: fromAccount.accountNumber,
    type: "TRANSFER_OUT",
    amount,
    balanceAfter: fromAccount.balance,
    timeStamp: new Date().toISOString(),
  })
  transactions.push({
    id: transactions.length+1,
    accountNumber: toAccount.accountNumber,
    type: "TRANSFER_IN",
    amount,
    balanceAfter: toAccount.balance,
    timeStamp: new Date().toISOString(),
  })
  res.json({
    from:fromAccount.accountNumber,
    to:toAccount.accountNumber,
    amount,
    timeStamp: new Date().toISOString()
  })
})

// Transactions
app.get("/accounts/:accountNumber/transactions", (req,res)=>{
  const accountNumber = req.params.accountNumber
  const transaction = transactions.filter((a)=>a.accountNumber===accountNumber)
  res.json(transaction)
})

// Recent Transactions
app.get("/transactions/recent", (req,res)=>{
  const transaction = transactions.slice(-5)
  res.json(transaction)
})
app.listen(8000, () => console.log("Server running on port 8000"));
