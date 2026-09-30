function StudentCard({ name = "Nane", marks = 0 }) {
  return (
    <div>
      <h1>Hello {name}</h1>
      <p>Marks: {marks}</p>
      <p>Status: {marks > 50 ? "Pass" : "Fail"}</p>
    </div>
  );
}

function NoStudent() {
  return <p>No students found</p>;
}

function Full() {
  const students = [
    { name: "Pinkey", marks: 90 },
    { name: "Rani", marks: 95 },
    { name: "Renu", marks: 92 },
    { name: "Rina", marks: 99 },
  ];
  return (
    <div>
      {/* Conditional Rendering */}
      {students.length > 0 && <p>There are {students.length} students</p>}

      {/* Ternary Operator */}
      {students.length == 0 ? (
        <NoStudent />
      ) : (
        students.map((s) => (
          <StudentCard key={s.name} name={s.name} marks={s.marks} />
        ))
      )}
      <StudentCard marks={100} />
    </div>
  );
}

export default Full;
