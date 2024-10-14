import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ThirdLogin.css";

const generateRandomWord = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let word = "";
  for (let i = 0; i < 4; i++) {
    word += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return word;
};

const ThirdLogin = () => {
  const [randomWord, setRandomWord] = useState("");
  const [decryptedWord, setDecryptedWord] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setRandomWord(generateRandomWord());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!decryptedWord) {
      setError("Please enter the decrypted word.");
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_THIRD_FACTOR_AUTH_LOGIN_LAMBDA_API_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.email,
            cipherText: randomWord,
            userAnswer: decryptedWord,
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
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          console.log("User found in localStorage on ThirdLogin:", storedUser);
          setUser(JSON.parse(storedUser));
        } else {
          console.log("No user found in localStorage");
        }
        await addLoginStats(user.email);
        navigate("/");
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("Failed to verify Caesar cipher");
      console.error(err);
    }
  };

  const addLoginStats = async (userId) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_ADD_LOGIN_STATS_LAMBDA_API_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (response.status !== 200) {
        console.error("Failed to log login stats");
      }
    } catch (err) {
      console.error("Error logging login stats:", err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Decrypt the word below </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Word: {randomWord}</label>
        </div>
        <div className="form-group">
          <label>Your Decrypted Word:</label>
          <input
            type="text"
            value={decryptedWord}
            onChange={(e) => setDecryptedWord(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ThirdLogin;
