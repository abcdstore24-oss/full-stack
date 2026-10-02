// Core business logic. No React code in this file.
// Money is stored in paise (integers) to avoid floating-point errors.
const KEY = "bank_data";

const load = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(KEY)) || {
        accounts: [],
        transactions: [],
      }
    );
  } catch {
    return { accounts: [], transactions: [] };
  }
};
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

export const formatMoney = (paise) =>
  "₹" +
  (paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export const TYPE_LABELS = {
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  TRANSFER_OUT: "Transfer sent",
  TRANSFER_IN: "Transfer received",
};

export function parseAmount(input) {
  const text = String(input ?? "").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(text))
    throw new Error("Enter a valid amount, like 250 or 250.50.");
  const paise = Math.round(parseFloat(text) * 100);
  if (paise <= 0) throw new Error("Amount must be greater than zero.");
  return paise;
}

function newAccountNumber(accounts) {
  let number;
  do {
    number = String(Math.floor(1e9 + Math.random() * 9e9));
  } while (accounts.some((a) => a.accountNumber === number));
  return number;
}

function log(data, accountNumber, type, amount, balanceAfter) {
  data.transactions.push({
    id: crypto.randomUUID(),
    accountNumber,
    type,
    amount,
    balanceAfter,
    timestamp: new Date().toISOString(),
  });
}

const find = (data, number) =>
  data.accounts.find((a) => a.accountNumber === number);

export const getAccounts = () => load().accounts;
export const getAccount = (number) => find(load(), number);
export const getTransactions = (number) =>
  load()
    .transactions.filter((t) => t.accountNumber === number)
    .reverse();
export const getRecentTransactions = (n = 5) =>
  load().transactions.slice(-n).reverse();

export function createAccount(name, openingInput) {
  if (!name.trim()) throw new Error("Enter the account holder's name.");
  const data = load();
  const opening =
    String(openingInput).trim() === "" ? 0 : parseAmount(openingInput);
  const account = {
    accountNumber: newAccountNumber(data.accounts),
    holder: name.trim(),
    balance: opening,
    createdAt: new Date().toISOString(),
  };
  data.accounts.push(account);
  if (opening > 0)
    log(data, account.accountNumber, "DEPOSIT", opening, opening);
  save(data);
  return account;
}

export function deposit(number, amountInput) {
  const amount = parseAmount(amountInput);
  const data = load();
  const acc = find(data, number);
  if (!acc) throw new Error("Account not found.");
  acc.balance += amount;
  log(data, number, "DEPOSIT", amount, acc.balance);
  save(data);
}

export function withdraw(number, amountInput) {
  const amount = parseAmount(amountInput);
  const data = load();
  const acc = find(data, number);
  if (!acc) throw new Error("Account not found.");
  if (amount > acc.balance)
    throw new Error(
      `Insufficient balance. Available: ${formatMoney(acc.balance)}.`,
    );
  acc.balance -= amount;
  log(data, number, "WITHDRAWAL", amount, acc.balance);
  save(data);
}

// One consistent transaction: all changes are saved in a single write.
export function transfer(fromNumber, toNumber, amountInput) {
  const amount = parseAmount(amountInput);
  const to = toNumber.trim();
  if (!fromNumber) throw new Error("Choose the account to send from.");
  if (!to) throw new Error("Enter the destination account number.");
  if (fromNumber === to)
    throw new Error("Source and destination must be different accounts.");
  const data = load();
  const from = find(data, fromNumber);
  const dest = find(data, to);
  if (!from) throw new Error("Source account not found.");
  if (!dest)
    throw new Error(
      `Destination account ${to} was not found. Check the number and try again.`,
    );
  if (amount > from.balance)
    throw new Error(
      `Insufficient balance. Available: ${formatMoney(from.balance)}.`,
    );
  from.balance -= amount;
  dest.balance += amount;
  log(data, from.accountNumber, "TRANSFER_OUT", amount, from.balance);
  log(data, dest.accountNumber, "TRANSFER_IN", amount, dest.balance);
  save(data);
  return {
    from: from.accountNumber,
    fromHolder: from.holder,
    to: dest.accountNumber,
    toHolder: dest.holder,
    amount,
    timestamp: new Date().toISOString(),
  };
}
