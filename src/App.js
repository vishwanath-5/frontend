import { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [msg, setMsg] = useState("");

  const API = "https://middleware-iez1.onrender.com";

  const signup = async () => {
    try {
      await axios.post(`${API}/signup`, { username, password });
      setMsg("User created ✅");
    } catch {
      setMsg("Signup failed ❌");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { username, password });
      if (res.data.user_id) {
        setUserId(res.data.user_id);
        loadTasks(res.data.user_id);
        setMsg("Login success ✅");
      } else {
        setMsg("Invalid credentials ❌");
      }
    } catch {
      setMsg("Login error ❌");
    }
  };

  const logout = () => {
    setUserId(null);
    setTasks([]);
    setMsg("Logged out 👋");
  };

  const addTask = async () => {
    if (!task) return;
    await axios.post(`${API}/add-task`, {
      user_id: userId,
      title: task,
    });
    setTask("");
    loadTasks(userId);
  };

  const loadTasks = async (id) => {
    const res = await axios.get(`${API}/tasks/${id}`);
    setTasks(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Task Manager 🚀</h2>

      <p>{msg}</p>

      {!userId ? (
        <>
          <input
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            onChange={e => setPassword(e.target.value)}
          />
          <br /><br />
          <button onClick={signup}>Signup</button>
          <button onClick={login}>Login</button>
        </>
      ) : (
        <>
          <button onClick={logout}>Logout</button>
          <h3>Your Tasks</h3>

          <input
            placeholder="New Task"
            value={task}
            onChange={e => setTask(e.target.value)}
          />
          <button onClick={addTask}>Add</button>

          <ul>
            {tasks.map(t => (
              <li key={t.id}>{t.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;