import React, { useState, useRef, useEffect } from "react";
import './Styles/TableActions.css';
const TableActions: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <td className="actions-cell">
      <div className="menu-container" ref={menuRef}>
        <button
          className="menu-btn"
          onClick={() => setOpen((prev) => !prev)}   // CLICK → TOGGLE
        >
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>

        {open && (
          <div className="menu-dropdown">
            <button className="menu-item edit-btn">
              <i className="fa-solid fa-pen"></i> Edit
            </button>

            <button className="menu-item deactivate-btn">
              <i className="fa-solid fa-user-slash"></i> Deactivate
            </button>
          </div>
        )}
      </div>
    </td>
  );
};

export default TableActions;
