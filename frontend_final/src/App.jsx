import { useState } from "react";
import "./App.css";

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

    try {
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

    } catch (err) {
      console.error(err);
      alert("Backend not responding!");
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>🎓 Student Performance Predictor</h1>

        <form onSubmit={handleSubmit}>

          <label>Study Hours</label>
          <input name="Hours_Studied" onChange={handleChange} />

          <label>Attendance (%)</label>
          <input name="Attendance" onChange={handleChange} />

          <label>Sleep Hours</label>
          <input name="Sleep_Hours" onChange={handleChange} />

          <label>Previous Score</label>
          <input name="Previous_Scores" onChange={handleChange} />

          <label>Motivation Level</label>
          <select name="Motivation_Level" onChange={handleChange}>
            <option value="">Select</option>
            <option value="0">Low</option>
            <option value="1">Medium</option>
            <option value="2">High</option>
          </select>

          <label>Tutoring Sessions</label>
          <input name="Tutoring_Sessions" onChange={handleChange} />

          <button type="submit">Predict 🚀</button>
        </form>

        {result && (
          <div className="result">
            <h2>{result.predicted_score}</h2>
            <p>{result.performance}</p>

            <div className="suggestion">
              {result.predicted_score < 60 && "⚠️ Increase study hours & consistency"}
              {result.predicted_score >= 60 && result.predicted_score < 75 && "👍 You're doing good, improve slightly"}
              {result.predicted_score >= 75 && "🔥 Excellent performance!"}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
