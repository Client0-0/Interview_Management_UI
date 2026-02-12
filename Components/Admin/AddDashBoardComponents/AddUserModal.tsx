import  { useState, type ChangeEvent } from "react";
import "./Styles/Model.css";
import { notifyError, notifySuccess } from "../../../Utils/toastHelper";

import {adminAddNewUser} from '../../../Services/User.Service';
import type { AddUserDto } from "../../../Models/user";
import { useNavigate } from "react-router-dom";


const AddUserModal = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<AddUserDto>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    roleName: "",
    
  });
  const closeModal = () => {
    navigate("/admin/users");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await adminAddNewUser(form);
      notifySuccess("User added successfully");     
     navigate("/admin/users");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notifyError(error.message || "Something went wrong");
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
            <input onChange={handleChange} name="fullName" placeholder="Enter full name" />
          </label>
          <label>
            Email
            <input name="email" onChange={handleChange} placeholder="user@company.com" />
          </label>
          <label>
            Password
            <input type="password" onChange={handleChange} name="password" placeholder="Enter password" />
          </label>
          <label>
            Phone Number
            <input  name="phone"  onChange={handleChange} placeholder="+91 9876543210" />
          </label>
          <label>
            Role
            <select
              name="roleName"
              value={form.roleName}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="Panel">Panel</option>
              <option value="HR">HR</option>
              <option value="Mentor">Mentor</option>
            </select>
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
