/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";

import {
  getAllDrives,
  //getDriveConfiguration,
} from "../../../Services/User.Service";
//import DriveView from "../View/DriveView/DriveView";
import { Outlet, useLocation, useNavigate } from "react-router-dom";



/* ================= TYPES ================= */

type DriveStatus =
  | "InProposal"
  | "Started"
  | "Halted"
  | "Completed"
  | "Cancelled"
  | "Closed";

interface Drive {
  driveId: number;
  driveName: string;
  driveDate: string;
  driveStatus: DriveStatus;
  createdBy: string;
  createdDate: string;
}



type DateFilter = "ALL" | "TODAY" | "UPCOMING" | "PAST";

/* ================= COMPONENT ================= */

const Drives: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | DriveStatus>("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilter>("ALL");

  const [drives, setDrives] = useState<Drive[]>([]);
  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  /* Menu state */
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  /* Date helpers */
  const today = new Date().toISOString().split("T")[0];
  const isToday = (d: string) => d === today;
  const isUpcoming = (d: string) => d > today;
  const isPast = (d: string) => d < today;
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    getAllDrives(1, 1000);
  }, [location.pathname]);
  /* ================= API FETCH ================= */
  useEffect(() => {
    getAllDrives(1, 1000)
      .then((res) => {
        const mapped: Drive[] = res.items.map((d: any) => ({
          driveId: d.driveId,
          driveName: d.driveName ?? "",
          driveDate: d.driveDate
            ? new Date(d.driveDate).toISOString().split("T")[0]
            : "",
          driveStatus: d.driveStatus as DriveStatus,
          createdBy: d.creatorName ?? "",
          createdDate: d.createdDate
            ? new Date(d.createdDate)
              .toISOString()
              .split("T")[0]
            : "",
        }));
        setDrives(mapped);
      })
      .catch((err) => {
        console.error("Failed to load drives", err);
        // ─── Mock fallback (no backend) ───
        const today = new Date().toISOString().split("T")[0];
        const upcoming = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
        const past = new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0];
        setDrives([
          { driveId: 601, driveName: "Campus Drive - JNTU", driveDate: today, driveStatus: "Started" as DriveStatus, createdBy: "Priya Sharma", createdDate: past },
          { driveId: 602, driveName: "Lateral Hiring - React", driveDate: upcoming, driveStatus: "InProposal" as DriveStatus, createdBy: "Amit Jain", createdDate: today },
          { driveId: 603, driveName: "Freshers Drive - Dec 2025", driveDate: past, driveStatus: "Completed" as DriveStatus, createdBy: "Kavitha Rao", createdDate: "2025-10-01" },
          { driveId: 604, driveName: "Walk-in Drive - Bangalore", driveDate: past, driveStatus: "Halted" as DriveStatus, createdBy: "Rahul Verma", createdDate: "2025-09-15" },
          { driveId: 605, driveName: "Intern Hiring - Summer 2026", driveDate: upcoming, driveStatus: "InProposal" as DriveStatus, createdBy: "Deepa Krishnan", createdDate: today },
        ]);
      });
  }, []);

  /* ================= FILTERING ================= */
  const filteredDrives = useMemo(() => {
    return drives.filter((d) => {
      const searchMatch =
        d.driveName.toLowerCase().includes(search.toLowerCase()) ||
        d.createdBy.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "ALL" || d.driveStatus === statusFilter;

      let dateMatch = true;
      if (dateFilter === "TODAY") dateMatch = isToday(d.driveDate);
      if (dateFilter === "UPCOMING")
        dateMatch = isUpcoming(d.driveDate);
      if (dateFilter === "PAST") dateMatch = isPast(d.driveDate);

      return searchMatch && statusMatch && dateMatch;
    });
  }, [drives, search, statusFilter, dateFilter]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDrives.length / pageSize)
  );

  const pagedDrives = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDrives.slice(startIndex, startIndex + pageSize);
  }, [filteredDrives, currentPage, pageSize]);

  const prevPage = () =>
    setCurrentPage((p) => (p > 1 ? p - 1 : p));
  const nextPage = () =>
    setCurrentPage((p) => (p < totalPages ? p + 1 : p));

  /* ================= ACTIONS ================= */
  // const handleView = async (driveId: number) => {
  //   const res = await getDriveConfiguration(driveId);

  //   navigate("driveview", {
  //     state: {
  //       driveId,
  //       mode: "view",
  //       config: res.data,
  //     },
  //   });
  // };


  // const handleEdit = async (driveId: number) => {
  //   const res = await getDriveConfiguration(driveId);

  //   navigate("driveview", {
  //     state: {
  //       driveId,
  //       mode: "edit",
  //       config: res.data,
  //     },
  //   });
  // };


  /* ================= RENDER ================= */
  return (
    <section className="page-container" onClick={() => setOpenMenu(null)}>
      <div className="mb-6">
        <h1>Drive Management</h1>
        <p className="text-muted">Create, track, and manage hiring drives</p>
      </div>

      {/* Toolbar */}
      <div className="users-toolbar">
        <div className="input-box" style={{ flex: 1, minWidth: '300px' }}>
          <i className="fa-solid fa-search input-icon"></i>
          <input
            className=""
            placeholder="Search by drive name or creator..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="right-actions">
          <select
            className="role-filter"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value as DateFilter);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Dates</option>
            <option value="TODAY">Today</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="PAST">Past</option>
          </select>

          <select
            className="role-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Status</option>
            <option value="InProposal">In Proposal</option>
            <option value="Started">Started</option>
            <option value="Halted">Halted</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Closed">Closed</option>
          </select>

          <button className="btn primary" onClick={() => navigate("createdrive")}>
            <i className="fa-solid fa-plus"></i>
            Create Drive
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Drive Date</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pagedDrives.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No drives found.
                </td>
              </tr>
            )}
            {pagedDrives.map((d, i) => (
              <tr key={d.driveId}>
                <td><div className="font-medium">{d.driveName}</div></td>
                <td className="text-muted">{d.driveDate}</td>
                <td>
                  <span
                    className={`badge ${d.driveStatus === 'Started' ? 'info' :
                      d.driveStatus === 'Completed' ? 'success' :
                        d.driveStatus === 'Halted' || d.driveStatus === 'Cancelled' ? 'danger' :
                          'neutral'
                      }`}
                  >
                    {d.driveStatus}
                  </span>
                </td>
                <td className="text-muted">{d.createdBy}</td>
                <td className="text-muted text-sm">{d.createdDate}</td>

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
                          className="menu-item add-btn"
                          onClick={() => navigate(`view/${d.driveId}/addcandidate`)}
                        >
                          <i className="fa-solid fa-user-plus text-muted"></i>
                          <span>Add Candidate</span>
                        </button>
                        <button
                          className="menu-item view-btn"
                          onClick={() => navigate(`view/${d.driveId}`)}
                        >
                          <i className="fa-solid fa-eye text-muted"></i>
                          <span>View</span>
                        </button>

                        <button
                          className="menu-item edit-btn"
                          onClick={() => navigate(`edit/${d.driveId}`)}
                        >
                          <i className="fa-solid fa-pen text-muted"></i>
                          <span>Edit</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination p-4 flex justify-center gap-2">
            <button
              className="btn secondary"
              disabled={currentPage === 1}
              onClick={prevPage}
            >
              &lt;
            </button>
            <span className="flex items-center px-2 text-sm text-muted">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn secondary"
              disabled={currentPage === totalPages}
              onClick={nextPage}
            >
              &gt;
            </button>
          </div>
        )}
      </div>



      <Outlet />

    </section>
  );
};

export default Drives;
