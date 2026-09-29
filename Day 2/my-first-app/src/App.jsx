import "./App.css";
import StudentCard from "./components/StudentCard.jsx";
function App() {
  const students = [
    { name: "pinkey", marks: 90 },
    { name: "ravi", marks: 80 },
    { name: "rishu", marks: 10 },
    { name: "saheel", marks: 60 },
  ];
  return (
    <div>
      {students.map((s) => (
        <StudentCard name={s.name} marks={s.marks} />
      ))}
    </div>
  );
}

export default App;
