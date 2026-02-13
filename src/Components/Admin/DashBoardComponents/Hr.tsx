import React, { useEffect, useMemo, useState } from "react";

import { getAllHrs } from "../../../Services/User.Service";
import type { Users } from "../../../Models/user";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

const HR: React.FC = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "active" | "inactive">("ALL");

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [location.pathname]);

  const fetchUsers = async () => {
    try {
      const res = await getAllHrs();
      const list: Users[] = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];
      setUsers(list);
    } catch (err) {
      console.error("Failed to fetch HR users:", err);
      // ─── Mock fallback (no backend) ───
      setUsers([
        { userId: 501, fullName: "Kavitha Rao", email: "kavitha.r@company.com", phone: "9001122501", isActive: true, roleName: "HR" as never, createdDate: "2025-03-10T00:00:00", updatedDate: "" },
        { userId: 502, fullName: "Amit Jain", email: "amit.j@company.com", phone: "9001122502", isActive: true, roleName: "HR" as never, createdDate: "2025-04-22T00:00:00", updatedDate: "" },
        { userId: 503, fullName: "Nisha Agarwal", email: "nisha.a@company.com", phone: "9001122503", isActive: false, roleName: "HR" as never, createdDate: "2025-02-14T00:00:00", updatedDate: "" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filtered users for search + status
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter((u) => {
      const searchMatch =
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "ALL" ||
        (statusFilter === "active" && u.isActive === true) ||
        (statusFilter === "inactive" && u.isActive === false);

      return searchMatch && statusMatch;
    });
  }, [users, search, statusFilter]);

  // const handleDeactivateConfirm = async () => {
  //         if (!deactivateUser) return;

  //         try {
  //           await changeUserStatus(
  //             deactivateUser.userId,
  //             !deactivateUser.isActive
  //           );

  //           setUsers((prev) =>
  //             prev.map((u) =>
  //               u.userId === deactivateUser.userId
  //                 ? { ...u, isActive: !u.isActive }
  //                 : u
  //             )
  //           );

  //           notifySuccess("User status updated");
  //           setDeactivateUser(null);
  //         } catch (error) {
  //           notifyError("Failed to update user status");
  //           console.error(error);
  //         }
  //       };
  if (loading) return <p>Loading HRs...</p>;

  return (
    <section className="panels-page" onClick={() => setOpenMenu(null)}>
      <h2>HR Management</h2>
      <p className="muted">Manage HR members and access</p>

      {/* TOOLBAR */}
      <div className="users-toolbar">
        <div className="input-box" style={{ flex: 1, minWidth: '300px' }}>
          <i className="fa-solid fa-search input-icon"></i>
          <input
            placeholder="Search HR by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="right-actions">
          <select
            className="role-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as never)}
          >
            <option value="ALL">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="btn primary" onClick={() => navigate("addhr")}>
            Add HR
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-cell">
                No HR users found
              </td>
            </tr>
          )}

          {filteredUsers.map((h, i) => (
            <tr key={h.email + i}>
              <td>{h.fullName}</td>
              <td>{h.email}</td>
              <td>{h.phone}</td>
              <td>
                <span className={`status-pill ${h.isActive ? "active" : "inactive"}`}>
                  {h.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              {/* ACTIONS MENU */}
              <td className="actions-cell">
                <div className="menu-container" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="menu-btn"
                    onClick={() => setOpenMenu(openMenu === i ? null : i)}
                  >
                    ···
                  </button>

                  {openMenu === i && (
                    <div className="menu-dropdown">
                      <button
                        className="menu-item view-btn"
                        onClick={() => {
                          navigate("viewuser", { state: h });
                          setOpenMenu(null);
                        }}
                      >
                        <i className="fa-solid fa-eye"></i> View
                      </button>

                      <button className="menu-item edit-btn"
                        onClick={() => {
                          navigate(`edituser/${h.userId}`);
                          setOpenMenu(null);
                        }}
                      >
                        <i className="fa-solid fa-pen"></i> Edit
                      </button>

                      <button className="menu-item deactivate-btn"
                        onClick={() => {
                          navigate(`deactivateuser/${h.userId}`);
                          setOpenMenu(null);
                        }}
                      >
                        <i className="fa-solid fa-user-slash"></i>
                        {h.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODALS */}
      <Outlet />
    </section>
  );
};

export default HR;
