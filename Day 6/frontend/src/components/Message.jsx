export default function Message({ msg }) {
  if (!msg) return null;
  return (
    <p className={`msg ${msg.ok ? "ok" : "error"}`} role="alert">
      {msg.text}
    </p>
  );
}
