import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SecondFactorAuth.css";

const predefinedQuestions = [
  { id: 1, question: "What was the name of your favorite teacher?" },
  { id: 2, question: "What is the name of your favorite song?" },
  { id: 3, question: "Who is your favorite superhero character?" },
];

const SecondFactorAuth = () => {
  const [answers, setAnswers] = useState(predefinedQuestions.map(() => ""));
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allAnswered = answers.every((answer) => answer.trim() !== "");
    if (!allAnswered) {
      setError("Please answer all the security questions.");
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_SECOND_FACTOR_AUTH_LAMBDA_API_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: JSON.stringify({
              userId: user.email,
              questions: predefinedQuestions.map((q) => q.id),
              answers,
            }),
          }),
        }
      );

      if (response.status === 200) {
        navigate("/3fauth");
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("Failed to store security questions");
      console.error(err);
    }
  };

  return (
    <div className="second-factor-auth-container">
      <h2>Answer these questions!</h2>
      <form onSubmit={handleSubmit}>
        {predefinedQuestions.map((q, index) => (
          <div key={q.id} className="form-group">
            <label>{q.question}</label>
            <input
              type="text"
              value={answers[index]}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SecondFactorAuth;
