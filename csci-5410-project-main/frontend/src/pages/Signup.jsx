import React, { useState } from "react";
import FormInput from "../components/FormInput";
import { useNavigate, Link } from "react-router-dom";
import UserPool from "../UserPool";
import "./Signup.css";

const Signup = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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
    {
      id: 3,
      name: "confirmPassword",
      type: "password",
      placeholder: "Retype your password",
      label: "Confirm Password",
    },
  ];

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      UserPool.signUp(values.email, values.password, [], null, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          localStorage.setItem("user", JSON.stringify({ email: values.email }));
          console.log(data);
          navigate("/2fauth");
        }
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
    } else if (
      !values.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      errors.password =
        "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long.";
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  return (
    <div className="signup-container">
      <h2>Sign up</h2>
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

export default Signup;
