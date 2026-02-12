import React, { useEffect, useMemo, useState } from "react";
import "./Styles/User.css";
import type { Users } from "../../../Models/user";
import { getAllUsers } from "../../../Services/User.Service";
import { notifyError } from "../../../Utils/toastHelper";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const UsersComponent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);


  /* 🔍 Search + Role Filter (ADMIN BLOCKED) */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (u.roleName?.toUpperCase() === "ADMIN") return false;

      const searchMatch =
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const roleMatch =
        roleFilter === "ALL" ||
        u.roleName?.toLowerCase() === roleFilter.toLowerCase();

      return searchMatch && roleMatch;
    });
  }, [users, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, []);

   useEffect(() => {
    fetchUsers();
  }, [location.pathname]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      const usersArray: Users[] = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? [];
      setUsers(usersArray);
    } catch (error) {
      notifyError("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <section className="users-page" onClick={() => setOpenMenu(null)}>
      <h2>User Management</h2>
      <p className="muted">Add, edit, and manage system users</p>

      {/* Toolbar */}
      <div className="users-toolbar">
        <input
          className="wide-search"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="right-actions">
          <select
            className="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="HR">HR</option>
            <option value="MENTOR">Mentor</option>
            <option value="PANEL">Panel</option>
          </select>

          <button
            className="btn primary"
            onClick={() => navigate("adduser")}
          >
            Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={7} className="empty-cell">
                No users found
              </td>
            </tr>
          )}

          {filteredUsers.map((u, i) => (
            <tr key={u.userId}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.roleName}</td>
              <td>
                <span
                  className={`status-pill ${
                    u.isActive ? "active" : "inactive"
                  }`}
                >
                  {u.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                {u.createdDate
                  ? new Date(u.createdDate).toLocaleDateString()
                  : "-"}
              </td>

              <td className="actions-cell">
                <div
                  className="menu-container"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="menu-btn"
                    onClick={() =>
                      setOpenMenu(openMenu === i ? null : i)
                    }
                  >
                    ···
                  </button>

                  {openMenu === i && (
                    <div className="menu-dropdown">
                      <button
                        className="menu-item view-btn"
                        onClick={() => {
                          navigate("viewuser", { state: u });
                          setOpenMenu(null);
                        }}
                      >
                        <i className="fa-solid fa-eye"></i>
                        <span>View</span>
                      </button>

                      <button
                        className="menu-item edit-btn"
                        onClick={() => {
                          navigate(`edituser/${u.userId}`);
                          setOpenMenu(null);
                        }}
                      >
                        <i className="fa-solid fa-pen"></i>
                        <span>Edit</span>
                      </button>

                      <button
                        className="menu-item deactivate-btn"
                        onClick={() => {
                          navigate(`deactivateuser/${u.userId}`);
                          setOpenMenu(null);
                        }}
                      >
                        <i className="fa-solid fa-user-slash"></i>
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 URL-based modal renders here */}
      <Outlet />

      {/* Edit User Modal (state-based is OK here) */}
      
    </section>
  );
};

export default UsersComponent;
