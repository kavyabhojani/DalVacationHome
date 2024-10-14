import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ThirdFactorAuth.css";

const ThirdFactorAuth = () => {
  const [cipherKey, setCipherKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cipherKey) {
      setError("Please enter a cipher key.");
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_THIRD_FACTOR_AUTH_LAMBDA_API_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: JSON.stringify({
              userId: user.email,
              cipherKey,
            }),
          }),
        }
      );

      if (response.status === 200) {
        navigate("/login");
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("Failed to store cipher key");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Caesar Cipher Key</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Enter the key (number) that you would like to use for caesar cipher
            encryption
          </label>
          <input
            type="number"
            value={cipherKey}
            onChange={(e) => setCipherKey(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <label>
          Hint: You will use this key to decrypt a word when logging in, please
          remember your key.
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ThirdFactorAuth;
