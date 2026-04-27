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
  const [loading, setLoading] = useState(false); // New: track loading status

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      // REPLACE the URL below with your actual Render Backend URL
      const res = await fetch("https://your-backend-service-name.onrender.com/predict", {
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
    } catch (error) {
      console.error("Error connecting to server:", error);
      alert("Server is waking up. Please try again in 30 seconds.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "500px", margin: "auto", textAlign: "center" }}>
      <h1>🎓 Student Performance Predictor</h1>

      <form onSubmit={handleSubmit}>
        <input name="Hours_Studied" placeholder="Study Hours" onChange={handleChange} style={inputStyle} /><br/>
        <input name="Attendance" placeholder="Attendance %" onChange={handleChange} style={inputStyle} /><br/>
        <input name="Sleep_Hours" placeholder="Sleep Hours" onChange={handleChange} style={inputStyle} /><br/>
        <input name="Previous_Scores" placeholder="Previous Score" onChange={handleChange} style={inputStyle} /><br/>

        <select name="Motivation_Level" onChange={handleChange} style={inputStyle}>
          <option value="">Select Motivation</option>
          <option value="0">Low</option>
          <option value="1">Medium</option>
          <option value="2">High</option>
        </select>
        <br/>

        <input name="Tutoring_Sessions" placeholder="Tutoring Sessions" onChange={handleChange} style={inputStyle} /><br/>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Waking up server..." : "Predict"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h2>Predicted Score: {result.predicted_score}</h2>
          <h3>Performance: {result.performance}</h3>
        </div>
      )}
    </div>
  );
}

// Simple styles to clean it up
const inputStyle = { padding: "10px", width: "100%", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ddd" };
const buttonStyle = { padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" };

export default App;