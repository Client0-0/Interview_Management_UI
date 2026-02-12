
import { useState, type ChangeEvent } from "react";
import type { AddUserDto } from "../../../Models/user";
import { adminAddNewUser } from "../../../Services/User.Service";
import { notifySuccess, notifyError } from "../../../Utils/toastHelper";
import "./Styles/Model.css";
import { useNavigate } from "react-router-dom";

const AddMentorModal: React.FC = () => {
  const navigate=useNavigate();
  const onClose=()=>{
    navigate(-1);
  }
  const [form, setForm] = useState<AddUserDto>({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        roleName: "Mentor",
        
      });
    
      const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async () => {
        try {
          await adminAddNewUser(form);
          notifySuccess("User added successfully");     
          onClose();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          notifyError(error.message || "Something went wrong");
        }
      };

  return (
    <div className="modal-backdrop">
      <div className="modal large">
        <div className="modal-header">
          <h3>Add New Mentor</h3>
          <button className="close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-grid two-col">
          <label>
            Full Name
            <input name="fullName" onChange={handleChange} placeholder="Enter full name" />
          </label>

          <label>
            Email
            <input name="email" onChange={handleChange} placeholder="hr@example.com" />
          </label>

          <label>
            Phone Number
            <input name="phone" onChange={handleChange} placeholder="+91 9876543210" />
          </label>
   
          <label>
            Password
            <input type="password" onChange={handleChange} name="password" placeholder="Enter password" />
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={handleSubmit}>Add Mentor</button>
        </div>
      </div>
    </div>
  );
};

export default AddMentorModal;

