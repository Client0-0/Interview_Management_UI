import { useState, type ChangeEvent } from "react";
import "./Styles/Model.css";
import { notifyError, notifySuccess } from "../../../Utils/toastHelper";
import { adminAddNewUser } from "../../../Services/User.Service";
import type { AddUserDto } from "../../../Models/user";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
} from "../../../Utils/validation";

const AddUserModal = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<AddUserDto>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    roleName: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AddUserDto, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof AddUserDto, boolean>>>({});

  const closeModal = () => {
    navigate("/admin/users");
  };

  const validateField = (name: keyof AddUserDto, value: string) => {
    let error: string | null = null;

    switch (name) {
      case "fullName":
        error = validateRequired(value, "Full Name");
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "roleName":
        error = validateRequired(value, "Role");
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validate on change if already touched
    if (touched[name as keyof AddUserDto]) {
      validateField(name as keyof AddUserDto, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof AddUserDto, value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    // Optional: Validate immediately on focus
    validateField(name as keyof AddUserDto, form[name as keyof AddUserDto] || "");
  };

  const handleSubmit = async () => {
    // Validate all fields
    const newErrors: Partial<Record<keyof AddUserDto, string>> = {};
    let isValid = true;

    (Object.keys(form) as Array<keyof AddUserDto>).forEach((key) => {
      let error: string | null = null;
      switch (key) {
        case "fullName": error = validateRequired(form.fullName, "Full Name"); break;
        case "email": error = validateEmail(form.email); break;
        case "password": error = validatePassword(form.password); break;
        case "phone": error = validatePhone(form.phone); break;
        case "roleName": error = validateRequired(form.roleName, "Role"); break;
      }
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      phone: true,
      roleName: true
    });

    if (!isValid) return;

    try {
      await adminAddNewUser(form);
      notifySuccess("User added successfully");
      navigate("/admin/users");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      notifyError(message);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal large">
        <div className="modal-header">
          <h3>Add New User</h3>
          <button className="close" onClick={closeModal}>✕</button>
        </div>

        <div className="modal-grid">
          <label>
            Full Name
            <input
              name="fullName"
              placeholder="Enter full name"
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={errors.fullName ? "input-error" : ""}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </label>
          <label>
            Email
            <input
              name="email"
              placeholder="user@company.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </label>
          <label>
            Phone Number
            <input
              name="phone"
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </label>
          <label>
            Role
            <select
              name="roleName"
              value={form.roleName}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={errors.roleName ? "input-error" : ""}
            >
              <option value="" disabled>Select Role</option>
              <option value="Panel">Panel</option>
              <option value="HR">HR</option>
              <option value="Mentor">Mentor</option>
            </select>
            {errors.roleName && <span className="error-text">{errors.roleName}</span>}
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={closeModal}>Cancel</button>
          <button className="btn primary" onClick={handleSubmit}>Add User</button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
