import "./App.css";
import { useState, useEffect } from "react";

// Clear Completed
// Loading & Disable - to be continued
function App() {
  // const [tasks, setTasks] = useState(() => {
  //   const saved = localStorage.getItem("tasks");
  //   return saved ? JSON.parse(saved) : [];
  // });
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const [search, setSearch] = useState("");

  const [startEdit, setStartEdit] = useState(false);
  const [editText, setEditText] = useState("");

  const [visibleTasks, setVisibleTasks] = useState([]);

  const [isLoaded, setIsLoaded]=useState(false);

  const [error, setError]=useState("");


  const addTask = () => {
    if (input.trim() === "") return;
    if(tasks.filter((t)=>!t.done).length>=4){
      setError("Limit Exceeded. Can have at Max 4.")
      return;
    }
    if(tasks.find((t)=>t.task.toLowerCase()==input.toLowerCase())){
      setError("Task Already Exists.")
      return;
    }
    const newTask = { id: Date.now(), task: input };
    setTasks([...tasks, newTask]);
    setVisibleTasks([...tasks, newTask]);
    setInput("");
  };

  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id != id));
  }

  function editTask(id) {
    const task=tasks.find((t)=>t.id == id)
    console.log(task.done);
    if(task.done===true){
      return;
    }
    setEditText(tasks.find((t) => t.id == id).task);
    setStartEdit(id);
  }

  const saveTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id == id
          ? {
              ...t,
              task: editText,
            }
          : t,
      ),
    );
    setStartEdit(false);
    setEditText("");
  };

  function toggleDone(id) {
    setTasks(tasks.map((t) => (t.id == id ? { ...t, done: !t.done } : t)));
  }

  function updateVisible(filter) {
    if (filter === "completed") {
      setVisibleTasks(tasks.filter((t) => t.done));
    } else if (filter === "pending") {
      setVisibleTasks(tasks.filter((t) => !t.done));
    } else {
      setVisibleTasks(tasks);
    }
  }

  const searchQue = (query) => {
    setSearch(query);
    setVisibleTasks(
      tasks.filter((t) => t.task.toLowerCase().includes(query.toLowerCase())),
    );
  };
  useEffect(() => {
    if(!isLoaded) return;
    setError("");
    setVisibleTasks(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(()=>{
    const saved=localStorage.getItem("tasks");
    if(saved){
      setTasks(JSON.parse(saved));
      setVisibleTasks(JSON.parse(saved));
    }
    setIsLoaded(true);
  },[])


  
  return (
    <div className="app">
      <h1 className="title">My Tasks</h1>

      <div className="counter">
        {tasks.filter((t) => t.done == true).length} completed out of{" "}
        {tasks.length}
      </div>
      <div className="search">
        <input
          className="search-input"
          value={search}
          onChange={(e) => searchQue(e.target.value)}
          placeholder="Search a task"
        />
        <button className="btn">
          🔍︎
        </button>
      </div>

      <div className="add-row">
        <input
          className="text-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError("");
          }}
          placeholder="Enter a task"
        />
        <button className="btn btn-primary" onClick={() => addTask()}>
          Add
        </button>
      </div>

      {error && <p style={{color:"#fca5a5"}}>{error}</p>}

      <div className="filters">
        <button className="btn btn-filter" onClick={() => updateVisible("all")}>
          All
        </button>
        <button
          className="btn btn-filter"
          onClick={() => updateVisible("completed")}
        >
          Completed
        </button>
        <button
          className="btn btn-filter"
          onClick={() => updateVisible("pending")}
        >
          Pending
        </button>
      </div>

      <div className="clear">
        <button className="btn btn-clear" onClick={() => setTasks([])}>
          Clear All Tasks
        </button>
      </div>

      <div className="task-list">
        {tasks.length == 0 && <p className="empty">No Tasks</p>}
        {visibleTasks.map((t, index) => (
          <div className="task-card" key={t.id}>
            <input
              className="checkbox"
              checked={t.done}
              type="checkbox"
              onChange={() => toggleDone(t.id)}
            />
            {index+1}.
            {startEdit == t.id ? (
              <input
                className="text-input edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit Task"
              />
            ) : (
              <span
                className="task-text"
                style={{ textDecoration: t.done ? "line-through" : "none" }}
              >
                {t.task}
              </span>
            )}
            {startEdit == t.id ? (
              <button className="btn btn-save" onClick={() => saveTask(t.id)}>
                Save
              </button>
            ) : (
              <button className="btn btn-edit" onClick={() => editTask(t.id)}>
                Edit
              </button>
            )}
            <button className="btn btn-delete" onClick={() => deleteTask(t.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
