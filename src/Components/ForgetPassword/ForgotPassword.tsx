import React, { useState, type ChangeEvent, type FormEvent } from "react";
import "../Styles/ForgotPassword.css";
import { Link, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../Utils/toastHelper";

interface FormState {
  Email: string;
}

interface ErrorState {
  Email?: string;
}

const ForgotPassword: React.FC = () => {
  const [form, setForm] = useState<FormState>({ Email: "" });
  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    validate(newForm);
  };

  const validate = (newForm: FormState): boolean => {
    const temp: ErrorState = {};

    if (!newForm.Email) temp.Email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(newForm.Email))
      temp.Email = "Invalid email format.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;

    setIsLoading(true);
    try {
      // TODO: wire up to real API — e.g. await forgotPassword(form.Email)
      await new Promise((r) => setTimeout(r, 800)); // mock delay
      notifySuccess("OTP sent! Check your email.");
      navigate("/otp", { state: { email: form.Email } });
    } catch {
      notifyError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fp-wrapper">
      <div className="fp-card">
        <div className="fp-icon-circle">
          <span className="fp-lock-icon">
            <i className="fa-solid fa-unlock-keyhole"></i>
          </span>
        </div>

        <h2 className="fp-title">Forgot Password?</h2>
        <p className="fp-subtitle">
          Enter your registered email and we'll send you an OTP to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="fp-form-group">
            <label htmlFor="fp-email">Email address</label>
            <div className="fp-input-box">
              <span className="fp-input-icon">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                id="fp-email"
                type="email"
                name="Email"
                placeholder="you@example.com"
                value={form.Email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.Email && <small>{errors.Email}</small>}
          </div>

          <button
            className={`fp-btn-submit${isLoading ? " fp-btn-loading" : ""}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="fp-spinner"></span> Sending OTP…
              </>
            ) : (
              "Send OTP"
            )}
          </button>

          <p className="fp-back-text">
            <Link to="/login">
              <i className="fa-solid fa-arrow-left"></i> Back to Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
