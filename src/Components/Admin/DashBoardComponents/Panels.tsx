import React, { useEffect, useMemo, useState } from "react";

import type { Users } from "../../../Models/user";
import { getAllPanels } from "../../../Services/User.Service";
import { notifyError } from "../../../Utils/toastHelper";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Panels: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "active" | "inactive">("ALL");

  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔁 Fetch panels */
  const fetchPanels = async () => {
    try {
      const res = await getAllPanels();
      const list: Users[] = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? [];
      setUsers(list);
    } catch (err) {
      notifyError("Failed to load panel members");
      console.error(err);
      // ─── Mock fallback (no backend) ───
      setUsers([
        { userId: 301, fullName: "Suresh Kumar", email: "suresh.k@company.com", phone: "9988776601", isActive: true, roleName: "PANEL" as never, createdDate: "2025-06-10T00:00:00", updatedDate: "" },
        { userId: 302, fullName: "Divya Menon", email: "divya.m@company.com", phone: "9988776602", isActive: true, roleName: "PANEL" as never, createdDate: "2025-07-15T00:00:00", updatedDate: "" },
        { userId: 303, fullName: "Nikhil Rao", email: "nikhil.r@company.com", phone: "9988776603", isActive: false, roleName: "PANEL" as never, createdDate: "2025-05-20T00:00:00", updatedDate: "" },
        { userId: 304, fullName: "Rekha Gupta", email: "rekha.g@company.com", phone: "9988776604", isActive: true, roleName: "PANEL" as never, createdDate: "2025-08-01T00:00:00", updatedDate: "" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanels();
  }, []);

  /* 🔁 Refresh after modal closes */
  useEffect(() => {
    fetchPanels();
  }, [location.pathname]);

  /* 🔍 Filter */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const searchMatch =
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const roleMatch = u.roleName?.toUpperCase() === "PANEL";

      const statusMatch =
        statusFilter === "ALL" ||
        (statusFilter === "active" && u.isActive) ||
        (statusFilter === "inactive" && !u.isActive);

      return searchMatch && roleMatch && statusMatch;
    });
  }, [users, search, statusFilter]);

  if (loading) return <p>Loading panel members...</p>;

  return (
    <section className="panels-page" onClick={() => setOpenMenu(null)}>
      <h2>Panel Management</h2>
      <p className="muted">Manage interview panel members</p>

      {/* Toolbar */}
      <div className="users-toolbar">
        <div className="input-box" style={{ flex: 1, minWidth: '300px' }}>
          <i className="fa-solid fa-search input-icon"></i>
          <input
            placeholder="Search panel members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="right-actions">
          <select
            className="role-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | "active" | "inactive")
            }
          >
            <option value="ALL">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            className="btn primary"
            onClick={() => navigate("addpanel")}
          >
            <i className="fa-solid fa-plus"></i>
            Add Panel Member
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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-cell">
                No panel members found
              </td>
            </tr>
          )}

          {filteredUsers.map((p, i) => (
            <tr key={p.userId}>
              <td>{p.fullName}</td>
              <td>{p.email}</td>
              <td>{p.phone}</td>
              <td>
                <span
                  className={`status-pill ${p.isActive ? "active" : "inactive"
                    }`}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="actions-cell">
                <div
                  className="menu-container"

                >
                  <button
                    className="menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(i);
                    }}
                  >
                    ···
                  </button>

                  {openMenu === i && (
                    <div className="menu-dropdown">
                      <button
                        className="menu-item view-btn"
                        onClick={() => {

                          navigate("viewuser", { state: p })
                        }
                        }
                      >
                        <i className="fa-solid fa-eye"></i> View
                      </button>

                      <button
                        className="menu-item edit-btn"
                        onClick={() => {

                          navigate(`edituser/${p.userId}`)
                        }
                        }
                      >
                        <i className="fa-solid fa-pen"></i> Edit
                      </button>

                      <button
                        className="menu-item deactivate-btn"
                        onClick={() => {

                          navigate(`deactivateuser/${p.userId}`)
                        }
                        }
                      >
                        <i className="fa-solid fa-user-slash"></i>
                        {p.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 Route-based modals */}
      <Outlet />
    </section>
  );
};

export default Panels;
