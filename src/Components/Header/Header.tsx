import { useEffect, useRef, useState } from "react";
import { logout } from "../../Services/Auth.Service";
import { useNavigate } from "react-router-dom";
import { getItem } from "../../Services/LocalStorage.Service";
import { ChangePasswordModal } from "../ChangePassword/ChangePasswordModal";
import '../Styles/Header.css';
export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setOpenMenu(false);
  };
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const role = getItem("role");
  const email = getItem("email");
  
  const handleLogout = () => {
    navigate("/login");
    logout();
  };
  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <h2>{role} Dashboard</h2>
          <p>Welcome back, {email}</p>
        </div>

        <div className="nav-right" ref={menuRef}>
          {/* <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span> */}
          {/* Profile Icon */}
          <div className="profile-icon" onClick={() => setOpenMenu(!openMenu)}>
            <i className="fa-solid fa-user-circle"></i>
          </div>
          {openMenu && (
            <div className="profile-menu">
              <div className="menu-item">
                <i className="fa-solid fa-user-pen"></i> Edit Profile
              </div>
              <div className="menu-item" onClick={openModal}>
                <i className="fa-solid fa-key"></i> Change Password
              </div>
              <div className="menu-item logout" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </div>
            </div>
          )}
        </div>
      </nav>
      <ChangePasswordModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
