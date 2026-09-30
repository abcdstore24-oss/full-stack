import "./App.css";
import { useState, useEffect } from "react";

// Search - variable tasks match which match as per search
// Clear All Tasks - use a button to clear the entire tasks
// Prevent duplicates entry
// Limit to add of tasks - like only 10 tasks could be at max

// Loading & Disable - to be continued
function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const [startEdit, setStartEdit] = useState(false);
  const [editText, setEditText] = useState("");

  const [visibleTasks, setVisibleTasks]=useState([])

  const addTask = () => {
    if (input.trim() === "") return;
    const newTask = { id: Date.now(), task: input };
    setTasks([...tasks, newTask]);
    setVisibleTasks([...tasks, newTask])
    setInput("");
    localStorage.setItem("tasks", JSON.stringify(tasks))
  };


  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id != id));
  }

  function editTask(id) {
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

  function updateVisible(filter){
    if(filter==="completed"){
      setVisibleTasks(tasks.filter((t)=>t.done))
    } else if(filter==="pending"){
      setVisibleTasks(tasks.filter((t)=>!t.done))
    } else{
      setVisibleTasks(tasks)
    }
  }


  return (
    <>
      <div>
        {tasks.filter((t)=>t.task==true).length} completed out of {tasks.length}
      </div>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={() => addTask()}>Add</button>
      </div>
      <div>
        <button onClick={()=>updateVisible("all")}>All</button>
        <button onClick={()=>updateVisible("completed")}>Completed</button>
        <button onClick={()=>updateVisible("pending")}>Pending</button>
      </div>
      <div>
        {tasks.length == 0 && <p>No Tasks</p>}
        {visibleTasks.map((t) => (
          <div key={t.id}>
            <input checked={t.done} type="checkbox" onChange={() => toggleDone(t.id)} />
            {startEdit == t.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit Task"
              />
            ) : (
              <span style={{textDecoration:t.done?"line-through":"none"}}>{t.task}</span>
            )}
            {startEdit == t.id ? (
              <button onClick={() => saveTask(t.id)}>Save</button>
            ) : (
              <button onClick={() => editTask(t.id)}>Edit</button>
            )}
            <button onClick={() => deleteTask(t.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
