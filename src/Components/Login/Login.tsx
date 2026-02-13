import React, { useState, type ChangeEvent, type FormEvent } from "react";
import "../Styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../Services/Auth.Service";
import { notifyError, notifySuccess } from "../../Utils/toastHelper";
import axios from "axios";
import { setItem } from "../../Services/LocalStorage.Service";
import { jwtDecode } from "jwt-decode";

export interface LoginFormState {
  Username: string;
  password: string;
}

interface ErrorState {
  Username?: string;
  password?: string;
}

interface JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  exp: number;
}

// ─── MOCK CREDENTIALS (bypass backend for testing) ───
const MOCK_USERS: Record<string, { password: string; role: string; userId: string }> = {
  "admin@mock.com": { password: "admin123", role: "Admin", userId: "9001" },
  "hr@mock.com": { password: "hr123", role: "HR", userId: "9002" },
  "mentor@mock.com": { password: "mentor123", role: "Mentor", userId: "9003" },
  "panel@mock.com": { password: "panel123", role: "Panel", userId: "9004" },
};

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginFormState>({
    Username: "",
    password: "",
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    validate(newForm);
  };

  const validate = (newForm: LoginFormState): boolean => {
    const temp: ErrorState = {};

    if (!newForm.Username) temp.Username = "Email is required...";
    else if (!/\S+@\S+\.\S+/.test(newForm.Username))
      temp.Username = "Invalid Email";

    if (!newForm.password) temp.password = "Password is required...";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;

    // ─── Mock login (no backend needed) ───
    const mockUser = MOCK_USERS[form.Username.toLowerCase()];
    if (mockUser && form.password === mockUser.password) {
      setItem("token", "mock-token");
      setItem("role", mockUser.role);
      setItem("userId", mockUser.userId);
      setItem("email", form.Username);

      const role = mockUser.role.toLowerCase();
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "hr") navigate("/hr");
      else if (role === "mentor") navigate("/mentor");
      else if (role === "panel") navigate("/panel");

      notifySuccess(mockUser.role + " logged in (mock)");
      return;
    }

    try {
      const res = await login(form);

      const token = res.data.data;
      setItem("token", token);

      const decoded = jwtDecode<JwtPayload>(token);
      const role =
        decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      console.log(decoded);
      const userId =
        decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      setItem("role", role);
      setItem("userId", String(userId))
      setItem("email", form.Username);

      if (role.toLowerCase() === "admin") navigate("/admin/dashboard");
      else if (role.toLowerCase() === "hr") navigate("/hr");
      else if (role.toLowerCase() === "mentor") navigate("/mentor");
      else if (role.toLowerCase() === "panel") navigate("/panel");
      else navigate("/mentorDashboard");

      notifySuccess(role + " logged Successfully");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        notifyError(err.response?.data?.error || "Something went wrong");
      } else {
        notifyError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="icon-circle">
          <span className="lock-icon">
            <i className="fa-solid fa-lock"></i>
          </span>
        </div>

        <h2 className="title">Welcome back</h2>
        <p className="subtitle">Sign in to your account to continue</p>

        <div className="form-group">
          <label>Email address</label>
          <div className="input-box">
            <span className="input-icon">
              <i className="fa-solid fa-envelope"></i>
            </span>
            <input
              type="email"
              name="Username"
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </div>
          {errors.Username && <small>{errors.Username}</small>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-box">
            <span className="input-icon">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>
          {errors.password && <small>{errors.password}</small>}
        </div>

        <div className="options">
          <label>
            <input type="checkbox" /> Remember me
          </label>

          <Link className="forgot" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <button className="btn-login" onClick={handleSubmit}>
          Sign in
        </button>

        <p className="signup-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
