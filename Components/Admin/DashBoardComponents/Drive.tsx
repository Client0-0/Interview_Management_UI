/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import "./Styles/Drive.css";
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
  const location=useLocation();
  const navigate = useNavigate();
  useEffect(() => {
        getAllDrives(1,1000);
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
      .catch((err) => console.error("Failed to load drives", err));
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
    <section
      className="drive-page"
      onClick={() => setOpenMenu(null)}
    >
      <div className="page-header">
        <div>
          <h2>Drive Management</h2>
          <p className="muted">
            Create, track, and manage hiring drives
          </p>
        </div>

        <button className="btn primary" onClick={() => navigate("createdrive")}>
          Create Drive
        </button>
      </div>

      <div className="users-toolbar">
        <input
          className="wide-search"
          placeholder="Search by drive name or creator..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

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

        <select
          className="role-filter"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      <div className="table-wrapper">
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
            {pagedDrives.map((d, i) => (
              <tr key={d.driveId}>
                <td>{d.driveName}</td>
                <td>{d.driveDate}</td>
                <td>
                  <span
                    className={`status-pill ${d.driveStatus.toLowerCase()}`}
                  >
                    {d.driveStatus}
                  </span>
                </td>
                <td>{d.createdBy}</td>
                <td>{d.createdDate}</td>

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
                      ⋯
                    </button>

                    {openMenu === i && (
                      <div className="menu-dropdown">
                        <button
                          className="menu-item"
                           onClick={() => navigate(`view/${d.driveId}/addcandidate`)}
                        >
                          <i className="add fa-solid fa-user-plus"></i>
                          <span>Add Candidate</span>
                        </button>
                        <button
                          className="menu-item"
                           onClick={() => navigate(`view/${d.driveId}`)}
                        >
                          <i className="fa-solid fa-eye"></i>
                          <span>View</span>
                        </button>

                        <button
                          className="menu-item"
                          onClick={() => navigate(`edit/${d.driveId}`)}
                        >
                          <i className="edit fa-solid fa-pen"></i>
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
          <div className="pagination">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={prevPage}
            >
              &lt;
            </button>
            <button className="page-btn active">
              {currentPage}
            </button>
            <button
              className="page-btn"
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
