import React, { useEffect, useMemo, useState } from "react";

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
      // ─── Mock fallback (no backend) ───
      setUsers([
        { userId: 101, fullName: "Priya Sharma", email: "priya.sharma@company.com", phone: "9876543210", isActive: true, roleName: "HR" as never, createdDate: "2025-08-15T00:00:00", updatedDate: "" },
        { userId: 102, fullName: "Rahul Verma", email: "rahul.verma@company.com", phone: "9876543211", isActive: true, roleName: "MENTOR" as never, createdDate: "2025-09-01T00:00:00", updatedDate: "" },
        { userId: 103, fullName: "Anjali Nair", email: "anjali.nair@company.com", phone: "9876543212", isActive: true, roleName: "PANEL" as never, createdDate: "2025-09-10T00:00:00", updatedDate: "" },
        { userId: 104, fullName: "Vikram Patel", email: "vikram.patel@company.com", phone: "9876543213", isActive: false, roleName: "PANEL" as never, createdDate: "2025-07-20T00:00:00", updatedDate: "" },
        { userId: 105, fullName: "Deepa Krishnan", email: "deepa.k@company.com", phone: "9876543214", isActive: true, roleName: "HR" as never, createdDate: "2025-10-05T00:00:00", updatedDate: "" },
        { userId: 106, fullName: "Arjun Mehta", email: "arjun.mehta@company.com", phone: "9876543215", isActive: true, roleName: "MENTOR" as never, createdDate: "2025-10-12T00:00:00", updatedDate: "" },
      ]);
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
        <div className="input-box" style={{ flex: 1, minWidth: '300px' }}>
          <i className="fa-solid fa-search input-icon"></i>
          <input
            className=""
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
            <i className="fa-solid fa-plus"></i>
            Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
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
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No users found matching your search.
                </td>
              </tr>
            )}

            {filteredUsers.map((u, i) => (
              <tr key={u.userId}>
                <td>
                  <div className="font-medium">{u.fullName}</div>
                </td>
                <td className="text-muted">{u.email}</td>
                <td className="text-muted">{u.phone}</td>
                <td>
                  <span className={`badge ${u.roleName?.toUpperCase() === 'HR' ? 'info' :
                    u.roleName?.toUpperCase() === 'MENTOR' ? 'warning' : 'neutral'
                    }`}>
                    {u.roleName}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${u.isActive ? "success" : "danger"}`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="text-muted text-sm">
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
                      <i className="fa-solid fa-ellipsis-vertical"></i>
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
                          <span>View Details</span>
                        </button>

                        <button
                          className="menu-item edit-btn"
                          onClick={() => {
                            navigate(`edituser/${u.userId}`);
                            setOpenMenu(null);
                          }}
                        >
                          <i className="fa-solid fa-pen"></i>
                          <span>Edit User</span>
                        </button>

                        <button
                          className="menu-item deactivate-btn"
                          onClick={() => {
                            navigate(`deactivateuser/${u.userId}`);
                            setOpenMenu(null);
                          }}
                        >
                          <i className={`fa-solid ${u.isActive ? 'fa-user-slash' : 'fa-user-check'}`}></i>
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
      </div>

      {/* 🔥 URL-based modal renders here */}
      <Outlet />

      {/* Edit User Modal (state-based is OK here) */}

    </section>
  );
};

export default UsersComponent;
