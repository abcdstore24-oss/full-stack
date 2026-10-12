const express = require("express");
const cors = require("cors");
const app = express();

const mysql = require('mysql2/promise')

app.use(cors());
app.use(express.json());
require("dotenv").config();

async function startServer(){
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
  console.log("Database connected")

    
  // Create Account
  app.post("/accounts",async (req, res) => {
    const { name, amount } = req.body;
    if(!name){
      return res.status(400).json({
          error: "Please enter a valid name."
      });
    }
    const accountNumber =  crypto.randomUUID().replace(/\D/g, "").slice(0, 10)
    await db.query("INSERT INTO accounts (name, account_number, balance) VALUES (?,?,?)", [name, accountNumber, amount])
    
    res.json({name, accountNumber, amount});
  });

  // Fetch Account
  app.get("/accounts", async (req,res)=>{
    const [rows]=await db.query("SELECT * FROM accounts");
    res.json(rows)
  })

  // Get a Account
  app.get("/accounts/:accountNumber", async (req, res)=>{
    const accountNumber = req.params.accountNumber
    const [rows]=await db.query("SELECT * FROM accounts WHERE account_number = (?)", accountNumber);

    if(rows.length==0){
      return res.status(404).json({
        error: "Account Not Found."
      })
    }
    return res.json(rows[0]);
  })

  // Deposit
  app.post("/accounts/:accountNumber/deposit", async (req, res)=>{
    const accountNumber = req.params.accountNumber;
    const [accounts] = await db.query("SELECT * FROM accounts WHERE account_number = (?)", accountNumber);
    if(accounts.length==0){
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
    const account = accounts[0];
    const newBalance = Number(account.balance) + amount;

    await db.query("UPDATE accounts SET balance = (?) WHERE account_number = (?)", [newBalance, account.account_number])

    await db.query("INSERT INTO transactions (account_number, type, amount, balance_after) VALUES (?,?,?,?)", [account.account_number, "DEPOSIT", amount, newBalance])
    
    res.json({...account, balance:newBalance})
  })

  // Withdraw
  app.post("/accounts/:accountNumber/withdraw",async  (req, res)=>{
    const accountNumber = req.params.accountNumber;
    const [accounts] = await db.query("SELECT * FROM accounts WHERE account_number = (?)", accountNumber);
    if(accounts.length==0){
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
    const account = accounts[0];
    if(amount> account.balance){
      return res.status(500).json({
        error: "Insufficient Balance."
      })
    }
    const newBalance = account.balance -amount;

    await db.query("UPDATE accounts SET balance = (?) WHERE account_number = (?)", [newBalance, account.account_number])

    await db.query("INSERT INTO transactions (account_number, type, amount, balance_after) VALUES (?,?,?,?)", [account.account_number, "WITHDRAWAL", amount, newBalance])
    
    res.json({...account, balance:newBalance})
  })

  // Transfer
  app.post("/transfer", async (req,res) => {
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
    
    const [fromRows] = await db.query("SELECT * FROM accounts WHERE account_number = (?)", from);
    const [toRows] = await db.query("SELECT * FROM accounts WHERE account_number = (?)", to);
    if(fromRows.length==0){
      return res.status(404).json({
        error:"Source Account not found."
      })
    }

    if(toRows.length==0){
      return res.status(404).json({
        error:"Destination Account not found."
      })
    }

    const fromAccount = fromRows[0]
    if(amount > fromAccount.balance){
      return res.status(400).json({
        error:"Insufficient Balance."
      })
    }
    
    try{
      const toAccount = toRows[0]
      
      const newFromBalance = Number(fromAccount.balance) - amount;
      const newToBalance = Number(toAccount.balance) + amount;
      
      db.beginTransaction()
      // FROM
      await db.query("UPDATE accounts SET balance = (?) WHERE account_number = (?)", [newFromBalance, fromAccount.account_number])
      await db.query("INSERT INTO transactions (account_number, type, amount, balance_after) VALUES (?,?,?,?)", [fromAccount.account_number, "TRANSFER_OUT", amount, newFromBalance])

      // TO
      await db.query("UPDATE accounts SET balance = (?) WHERE account_number = (?)", [newToBalance, toAccount.account_number])
      await db.query("INSERT INTO transactions (account_number, type, amount, balance_after) VALUES (?,?,?,?)", [toAccount.account_number, "TRANSFER_IN", amount, newToBalance])

      db.commit();
      res.json({
      from:fromAccount.account_number,
      to:toAccount.account_number,
      amount,
      timeStamp: new Date().toISOString()
    })
    } catch{
      db.rollback();
      res.status(400).json({
        error:"Database Error."
      })
    }
    
  })

  // Transactions
  app.get("/accounts/:accountNumber/transactions", async (req,res)=>{
    const accountNumber = req.params.accountNumber
    const [rows] = await db.query("SELECT * FROM transactions where account_number = (?) ORDER BY created_at DESC", [accountNumber])
    res.json(rows)
  })

  // Recent Transactions
  app.get("/transactions/recent", async (req,res)=>{
    const [rows] = await db.query("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5", [])
    res.json(rows)
  })

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
