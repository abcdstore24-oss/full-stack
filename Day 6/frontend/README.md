# Passbook: banking app (React frontend)

Stack: React 18, Vite, react-router-dom, plain CSS. No other libraries.

## Run
    npm install
    npm run dev

## Pages (react-router)
- `/` dashboard   - `/accounts/new` open account   - `/accounts/:accountNumber` summary, deposit, withdraw
- `/transfer` transfer + result   - `/accounts/:accountNumber/statement` statement   - `*` not found

## Structure
- `src/services/bankService.js`: all business logic and validation (no React)
- `src/pages`, `src/components`: UI only

## Assumptions
- Data is saved in the browser's localStorage (replaces a file/DB). Clear it to reset.
- Money is stored in paise (integers). Currency: INR. No secrets or env config are needed.

## Negative tests to try
1. Deposit `abc` or `-5` (invalid amount)  2. Withdraw more than the balance  3. Transfer to `0000000000` (destination not found)
