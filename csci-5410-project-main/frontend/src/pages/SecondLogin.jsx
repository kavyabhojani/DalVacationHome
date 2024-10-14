import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SecondLogin.css";

const predefinedQuestions = [
  { id: 1, question: "What was the name of your favorite teacher?" },
  { id: 2, question: "What is the name of your favorite song?" },
  { id: 3, question: "Who is your favorite superhero character?" },
];

const getRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * predefinedQuestions.length);
  return predefinedQuestions[randomIndex];
};

const SecondLogin = () => {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [question, setQuestion] = useState(getRandomQuestion());
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("User found in localStorage on SecondLogin:", storedUser);
      setUser(JSON.parse(storedUser));
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answer.trim() === "") {
      setError("Please provide an answer.");
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_SECOND_FACTOR_AUTH_LOGIN_LAMBDA_API_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: JSON.stringify({
              userId: user.email,
              questionId: question.id,
              answer,
            }),
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.statusCode !== 200) {
        setError("Failed to verify security question");
        return;
      }
      if (response.status === 200) {
        navigate("/third-login");
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("Failed to verify security question");
      console.error(err);
    }
  };

  return (
    <div className="login-second-factor-auth-container">
      <h2>Security Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{question.question}</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SecondLogin;
