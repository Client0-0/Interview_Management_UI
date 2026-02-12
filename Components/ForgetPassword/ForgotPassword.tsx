import React, { useState, type ChangeEvent, type FormEvent } from "react";
import "../Styles/ForgotPassword.css";

interface FormState {
  Email: string;
}

interface ErrorState {
  Email?: string;
}

const ForgotPassword: React.FC = () => {
  const [form, setForm] = useState<FormState>({ Email: "" });
  const [errors, setErrors] = useState<ErrorState>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    validate(newForm);
  };

  const validate = (newForm: FormState): boolean => {
    const temp: ErrorState = {};

    if (!newForm.Email) temp.Email = "Email is required...";
    else if (!/\S+@\S+\.\S+/.test(newForm.Email))
      temp.Email = "Invalid email format";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;
    // submit logic
  };

  return (
    <div className="fp-wrapper">
      <div className="fp-card">
        <div className="fp-icon-circle">
          <span className="fp-lock-icon">
            <i className="fa-solid fa-unlock-keyhole"></i>
          </span>
        </div>

        <h2 className="fp-title">Forgot Password</h2>
        <p className="fp-subtitle">
          Enter your email and we’ll send you a OTP.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="fp-form-group">
            <label>Email address</label>
            <div className="fp-input-box">
              <span className="fp-input-icon">
                <i className="fa-solid fa-envelope text-gray-400 text-lg"></i>
              </span>
              <input
                type="email"
                name="Email"
                placeholder="you@example.com"
                onChange={handleChange}
              />
            </div>
            {errors.Email && <small>{errors.Email}</small>}
          </div>

          <button className="fp-btn-submit" onClick={handleSubmit}>Send OTP</button>

          <p className="fp-back-text">
            <a href="/login">Back to sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
