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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null); // Clear previous results

    try {
      // NOTE: Added "/predict" to your base Render URL
      const res = await fetch(
        "https://student-performance-predictor-2-1zbc.onrender.com/predict",
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

      if (!res.ok) {
        throw new Error("Backend is still waking up...");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Connection Error:", err);
      alert(
        "The server is taking a moment to wake up. Please wait 30 seconds and try again!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>🎓 Student Performance Predictor</h1>
        <p className="subtitle">Enter details to predict your academic score</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Study Hours</label>
            <input
              name="Hours_Studied"
              type="number"
              onChange={handleChange}
              required
              placeholder="e.g. 5"
            />
          </div>

          <div className="input-group">
            <label>Attendance (%)</label>
            <input
              name="Attendance"
              type="number"
              onChange={handleChange}
              required
              placeholder="e.g. 85"
            />
          </div>

          <div className="input-group">
            <label>Sleep Hours</label>
            <input
              name="Sleep_Hours"
              type="number"
              onChange={handleChange}
              required
              placeholder="e.g. 7"
            />
          </div>

          <div className="input-group">
            <label>Previous Score</label>
            <input
              name="Previous_Scores"
              type="number"
              onChange={handleChange}
              required
              placeholder="e.g. 70"
            />
          </div>

          <div className="input-group">
            <label>Motivation Level</label>
            <select name="Motivation_Level" onChange={handleChange} required>
              <option value="">Select</option>
              <option value="0">Low</option>
              <option value="1">Medium</option>
              <option value="2">High</option>
            </select>
          </div>

          <div className="input-group">
            <label>Tutoring Sessions</label>
            <input
              name="Tutoring_Sessions"
              type="number"
              onChange={handleChange}
              required
              placeholder="e.g. 2"
            />
          </div>

          <button type="submit" className="predict-btn" disabled={loading}>
            {loading ? "Waking up Server... ⏳" : "Predict Performance 🚀"}
          </button>
        </form>

        {result && (
          <div className="result-area">
            <hr />
            <div className="result-card">
              <h2>
                Predicted Score:{" "}
                <span className="score">{result.predicted_score}</span>
              </h2>
              <p className="status-tag">
                Performance: <strong>{result.performance}</strong>
              </p>

              <div className="suggestion-box">
                {result.predicted_score < 60 &&
                  "⚠️ Focus on increasing study hours and consistency."}
                {result.predicted_score >= 60 &&
                  result.predicted_score < 75 &&
                  "👍 Good job! A little more effort will yield great results."}
                {result.predicted_score >= 75 &&
                  "🔥 Excellent! Keep maintaining this pace."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
