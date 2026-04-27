import { useState } from 'react'
import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    Hours_Studied: "",
    Attendance: "",
    Sleep_Hours: "",
    Previous_Scores: "",
    Motivation_Level: "",
    Tutoring_Sessions: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Hours_Studied: Number(form.Hours_Studied),
        Attendance: Number(form.Attendance),
        Sleep_Hours: Number(form.Sleep_Hours),
        Previous_Scores: Number(form.Previous_Scores),
        Motivation_Level: Number(form.Motivation_Level),
        Tutoring_Sessions: Number(form.Tutoring_Sessions)
      })
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: "30px", maxWidth: "500px", margin: "auto" }}>
      <h1>🎓 Student Performance Predictor</h1>

      <form onSubmit={handleSubmit}>
        <input name="Hours_Studied" placeholder="Study Hours" onChange={handleChange} /><br/><br/>
        <input name="Attendance" placeholder="Attendance %" onChange={handleChange} /><br/><br/>
        <input name="Sleep_Hours" placeholder="Sleep Hours" onChange={handleChange} /><br/><br/>
        <input name="Previous_Scores" placeholder="Previous Score" onChange={handleChange} /><br/><br/>

        <select name="Motivation_Level" onChange={handleChange}>
          <option value="">Select Motivation</option>
          <option value="0">Low</option>
          <option value="1">Medium</option>
          <option value="2">High</option>
        </select>
        <br/><br/>

        <input name="Tutoring_Sessions" placeholder="Tutoring Sessions" onChange={handleChange} /><br/><br/>

        <button type="submit">Predict</button>
      </form>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Predicted Score: {result.predicted_score}</h2>
          <h3>Performance: {result.performance}</h3>
        </div>
      )}
    </div>
  );
}

export default App;