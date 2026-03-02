import React, { useState, type ChangeEvent, type FormEvent } from "react";
import "./Styles/Login.css"; // reuse same styling
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../Services/Auth.Service";
import { notifyError, notifySuccess } from "../Utils/toastHelper";
import axios from "axios";

export interface SignUpFormState {
  Name: string;
  Role: string;
  EmailId: string;
  PhoneNumber: string;
  // Password: string;
  // ConfirmPassword: string;
}

interface ErrorState {
  Username?: string;
  Role?: string;
  Email?: string;
  Phone?: string;
}

const SignUp: React.FC = () => {
  const [form, setForm] = useState<SignUpFormState>({
    Name: "",
    Role: "",
    EmailId: "",
    PhoneNumber: "",
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const navigate = useNavigate();
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    validate(newForm);
  };

  const validate = (newForm: SignUpFormState): boolean => {
    const temp: ErrorState = {};

    if (!newForm.Name) temp.Username = "Username is required.";

    if (!newForm.Role) temp.Role = "Role is required.";

    if (!newForm.EmailId) temp.Email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(newForm.EmailId))
      temp.Email = "Invalid email.";

    if (!newForm.PhoneNumber) temp.Phone = "Phone number is required.";
    else if (!/^[0-9]{10}$/.test(newForm.PhoneNumber))
      temp.Phone = "Phone must be 10 digits.";

    // if (!newForm.Password) temp.Password = "Password is required.";

    // if (!newForm.ConfirmPassword)
    //   temp.ConfirmPassword = "Confirm your password.";
    // else if (newForm.Password !== newForm.ConfirmPassword)
    //   temp.ConfirmPassword = "Passwords do not match.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    console.log("SSSS", form);
    e.preventDefault();
    if (!validate(form)) {
      console.log("HEYY");
      return;
    }

    try {
      const res = await addUser(form);
      console.log(res);
      setForm({ Name: "", Role: "", EmailId: "", PhoneNumber: "" });
      notifySuccess("User registered successfully!");
      navigate('/login');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error || "Something went wrong!";
        notifyError(message);
        console.log("Axios Error:", message);
      } else {
        notifyError("An unexpected error occurred");
        console.log("Non-Axios Error:", err);
      }
    }
    // Submit logic here
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="icon-circle">
          <span className="lock-icon">
            <i className="fa-solid fa-lock"></i>
          </span>
        </div>

        <h2 className="title">Create an Account</h2>
        <p className="subtitle">Fill the details to continue</p>

        {/* Username */}
        <div className="form-group">
          <label>Username</label>
          <div className={`input-box ${errors.Username ? 'error' : ''}`}>
            <span className="input-icon">
              <i className="fa-solid fa-user text-gray-400 text-lg"></i>
            </span>
            <input
              type="text"
              name="Name"
              placeholder="Your username"
              onChange={handleChange}
            />
          </div>
          {errors.Username && <small className="error-text">{errors.Username}</small>}
        </div>

        {/* Role */}
        <div className="form-group">
          <label>Role</label>
          <div className={`input-box ${errors.Role ? 'error' : ''}`}>

            <select name="Role" onChange={handleChange}>
              <option value="">Select role</option>
              <option value="hr">HR</option>
              <option value="panel">Panel</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>
          {errors.Role && <small className="error-text">{errors.Role}</small>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <div className={`input-box ${errors.Email ? 'error' : ''}`}>
            <span className="input-icon">
              <i className="fa-solid fa-envelope text-gray-400 text-lg"></i>
            </span>
            <input
              type="email"
              name="EmailId"
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </div>
          {errors.Email && <small className="error-text">{errors.Email}</small>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone Number</label>
          <div className={`input-box ${errors.Phone ? 'error' : ''}`}>
            <span className="input-icon">
              <i className="fa-solid fa-phone text-gray-400 text-lg"></i>
            </span>
            <input
              type="text"
              name="PhoneNumber"
              placeholder="Enter Number"
              onChange={handleChange}
            />
          </div>
          {errors.Phone && <small className="error-text">{errors.Phone}</small>}
        </div>

        {/* Password */}
        {/* <div className="form-group">
          <label>Password</label>
          <div className="input-box">
            <span className="input-icon">
              <i className="fa-solid fa-lock text-gray-400 text-lg"></i>
            </span>
            <input
              type="password"
              name="Password"
              placeholder="Enter password"
              onChange={handleChange}
            />
          </div>
          {errors.Password && <small>{errors.Password}</small>}
        </div> */}

        {/* Confirm Password */}
        {/* <div className="form-group">
          <label>Confirm Password</label>
          <div className="input-box">
            <span className="input-icon">
              <i className="fa-solid fa-lock text-gray-400 text-lg"></i>
            </span>
            <input
              type="password"
              name="ConfirmPassword"
              placeholder="Re-enter password"
              onChange={handleChange}
            />
          </div>
          {errors.ConfirmPassword && <small>{errors.ConfirmPassword}</small>}
        </div> */}

        <button className="btn-login" onClick={handleSubmit}>
          Sign Up
        </button>

        <p className="signup-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
