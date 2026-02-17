import React, { useEffect, useMemo, useState } from "react";

import { getAllMentors } from "../../../Services/User.Service";
import type { Users } from "../../../Models/user";
import { Outlet, useLocation, useNavigate } from "react-router-dom";


const Mentor: React.FC = () => {

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "active" | "inactive">(
    "ALL"
  );
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  /* 🔍 Search + Status + HR-only filter */
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    return users.filter((u) => {
      // 🔎 search
      const searchMatch =
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      // ✅ HR only
      //const roleMatch = u.roleName?.toUpperCase() === "Mentor";

      // ✅ status filter
      const statusMatch =
        statusFilter === "ALL" ||
        (statusFilter === "active" && u.isActive === true) ||
        (statusFilter === "inactive" && u.isActive === false);
      return searchMatch && statusMatch;
    });
  }, [users, search, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllMentors();

      const usersArray: Users[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      setUsers(usersArray);
    } catch (error) {
      console.error("Failed to load users", error);
      // ─── Mock fallback (no backend) ───
      setUsers([
        { userId: 401, fullName: "Lakshmi Devi", email: "lakshmi.d@company.com", phone: "9112233401", isActive: true, roleName: "MENTOR" as never, createdDate: "2025-04-01T00:00:00", updatedDate: "" },
        { userId: 402, fullName: "Sanjay Mishra", email: "sanjay.m@company.com", phone: "9112233402", isActive: true, roleName: "MENTOR" as never, createdDate: "2025-05-10T00:00:00", updatedDate: "" },
        { userId: 403, fullName: "Pooja Hegde", email: "pooja.h@company.com", phone: "9112233403", isActive: false, roleName: "MENTOR" as never, createdDate: "2025-03-18T00:00:00", updatedDate: "" },
        { userId: 404, fullName: "Manoj Tiwari", email: "manoj.t@company.com", phone: "9112233404", isActive: true, roleName: "MENTOR" as never, createdDate: "2025-06-22T00:00:00", updatedDate: "" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [location.pathname]);
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

  if (loading) return <p>Loading users...</p>;

  return (
    <section className="panels-page" onClick={() => setOpenMenu(null)}>
      <h2>Mentor Management</h2>
      <p className="muted">Manage mentors and expertise</p>

      {/* TOOLBAR */}
      <div className="users-toolbar">
        <div className="input-box" style={{ flex: 1, minWidth: '300px' }}>
          <i className="fa-solid fa-search input-icon"></i>
          <input
            placeholder="Search mentors by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="right-actions">
          <select
            className="role-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as never)
            }
          >
            <option value="ALL">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="btn primary"
            onClick={() => navigate("addmentor")}>
            <i className="fa-solid fa-plus"></i>
            Add Mentor
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-cell">
                No mentors found
              </td>
            </tr>
          )}

          {filteredUsers.map((m, i) => (
            <tr key={i}>
              <td>{m.fullName}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>

              <td>
                <span className={`status-pill ${m.isActive ? "active" : "inactive"}`}>
                  {m.isActive ? "Active" : "Inactive"}
                </span>
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
                      <button className="menu-item view-btn" onClick={() => {
                        navigate("viewuser", { state: m })   // ✅ DATA SET
                        setOpenMenu(null);
                      }}>
                        <i className="fa-solid fa-eye"></i>
                        View
                      </button>

                      <button className="menu-item edit-btn"
                        onClick={() => {
                          navigate(`edituser/${m.userId}`);
                          setOpenMenu(null);
                        }}
                      >
                        <i className="fa-solid fa-pen"></i>
                        Edit
                      </button>

                      <button className="menu-item deactivate-btn"
                        onClick={() => {
                          navigate(`deactivateuser/${m.userId}`);
                          setOpenMenu(null);
                        }}
                      >
                        <i className="fa-solid fa-user-slash"></i>
                        Deactivate
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <Outlet />
    </section>
  );
};

export default Mentor;
