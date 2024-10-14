import { useState } from "react";
import FormInput from "../components/FormInput";
import { useNavigate } from "react-router-dom";
import UserPool from "../UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import "./Login.css";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "text",
      placeholder: "Email (userID)",
      label: "Email",
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      label: "Password",
    },
  ];

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      const user = new CognitoUser({
        Username: values.email,
        Pool: UserPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: values.email,
        Password: values.password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          localStorage.setItem("user", JSON.stringify({ email: values.email }));
          console.log("Stored in localStorage", localStorage.getItem("user"));
          console.log("onSuccess:", data);
          navigate("/second-login");
        },
        onFailure: (err) => {
          console.error("onFailure:", err);
          setErrors({ auth: "Invalid email or password" });
        },
      });
    } else {
      setErrors(validationErrors);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};
    if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Invalid email format.";
    }
    if (values.password.length < 8) {
      errors.password = "Password should be at least 8 characters.";
    }
    return errors;
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {inputs.map((input) => (
          <div key={input.id}>
            <FormInput
              {...input}
              value={values[input.name]}
              onChange={handleChange}
            />
            {errors[input.name] && (
              <p className="error-message">{errors[input.name]}</p>
            )}
          </div>
        ))}
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Login;
