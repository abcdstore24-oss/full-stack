import { formatMoney } from "../services/bankService.js";

export default function AccountCard({ account }) {
  const spaced = account.accountNumber.replace(
    /(\d{4})(\d{4})(\d+)/,
    "$1 $2 $3",
  );
  return (
    <div className="passbook">
      <span className="chip" aria-hidden="true" />
      <p className="pb-number">{spaced}</p>
      <p className="pb-balance">₹ {account.balance}</p>
      <p className="pb-holder">{account.name}</p>
    </div>
  );
}
