import { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    Hours_Studied: "",
    Attendance: "",
    Sleep_Hours: "",
    Previous_Scores: "",
    Motivation_Level: "",
    Tutoring_Sessions: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // 1. Added loading state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      // 2. CHANGE THIS URL to your Render Backend URL
      // It should look like: https://student-performance-backend.onrender.com/predict
      const res = await fetch(
        "https://student-performance-predictor-2-1zbc.onrender.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Hours_Studied: Number(form.Hours_Studied),
            Attendance: Number(form.Attendance),
            Sleep_Hours: Number(form.Sleep_Hours),
            Previous_Scores: Number(form.Previous_Scores),
            Motivation_Level: Number(form.Motivation_Level),
            Tutoring_Sessions: Number(form.Tutoring_Sessions),
          }),
        },
      );

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // 3. Updated alert for Render's free tier sleep mode
      alert("The server is waking up! Please wait 30 seconds and try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>🎓 Student Performance Predictor</h1>

        <form onSubmit={handleSubmit}>
          <label>Study Hours</label>
          <input
            name="Hours_Studied"
            type="number"
            onChange={handleChange}
            required
          />

          <label>Attendance (%)</label>
          <input
            name="Attendance"
            type="number"
            onChange={handleChange}
            required
          />

          <label>Sleep Hours</label>
          <input
            name="Sleep_Hours"
            type="number"
            onChange={handleChange}
            required
          />

          <label>Previous Score</label>
          <input
            name="Previous_Scores"
            type="number"
            onChange={handleChange}
            required
          />

          <label>Motivation Level</label>
          <select name="Motivation_Level" onChange={handleChange} required>
            <option value="">Select</option>
            <option value="0">Low</option>
            <option value="1">Medium</option>
            <option value="2">High</option>
          </select>

          <label>Tutoring Sessions</label>
          <input
            name="Tutoring_Sessions"
            type="number"
            onChange={handleChange}
            required
          />

          {/* 4. Disable button while loading */}
          <button type="submit" disabled={loading}>
            {loading ? "Waking up Server... ⏳" : "Predict 🚀"}
          </button>
        </form>

        {result && (
          <div className="result">
            <h2>Score: {result.predicted_score}</h2>
            <p>Status: {result.performance}</p>

            <div className="suggestion">
              {result.predicted_score < 60 &&
                "⚠️ Increase study hours & consistency"}
              {result.predicted_score >= 60 &&
                result.predicted_score < 75 &&
                "👍 You're doing good, improve slightly"}
              {result.predicted_score >= 75 && "🔥 Excellent performance!"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
