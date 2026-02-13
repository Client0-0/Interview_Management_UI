import React, { useEffect, useState } from "react";
import './Styles/dashboard.css'; // New styles.
import { getDashboardStats } from "../../../Services/Admin.Service";
import type { DashboardStats } from "../../../Models/user";
import DashboardCard from "../../common/DashboardCard";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data.data);
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
      // ─── Mock fallback (no backend) ───
      setStats({
        totalUsers: 24,
        totalCandidates: 56,
        totalPanelMembers: 8,
        totalMentors: 6,
        totalInterviews: 42,
        totalHrs: 4,
        totalCandidatesHired: 18,
        totalCandidatesRejected: 12,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  if (!stats) return <p>No data available</p>;
  return (
    <section className="admin-dashboard-container">
      <div className="mb-8">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">Overview of system statistics and performance.</p>
      </div>

      <div className="admin-stats-grid">

        <DashboardCard
          theme="blue"
          icon={<i className="fa-solid fa-users"></i>}
          title="Total Users"
          value={stats.totalUsers + ""}
        />
        <DashboardCard
          theme="green"
          icon={<i className="fa-solid fa-user-graduate"></i>}
          title="Total Candidates"
          value={stats.totalCandidates + ""}
        />
        <DashboardCard
          theme="cyan"
          icon={<i className="fa-solid fa-gavel"></i>}
          title="Panel Members"
          value={stats.totalPanelMembers + ""}
        />
        <DashboardCard
          theme="orange"
          icon={<i className="fa-solid fa-user-gear"></i>}
          title="Mentors/Coordinators"
          value={stats.totalMentors + ""}
        />
        <DashboardCard
          theme="purple"
          icon={<i className="fa-solid fa-calendar-days"></i>}
          title="Interviews"
          value={stats.totalInterviews + ""}
        />
        <DashboardCard
          theme="gray"
          icon={<i className="fa-solid fa-building"></i>}
          title="Human Resources"
          value={stats.totalHrs + ""}
        />
        <DashboardCard
          theme="green"
          icon={<i className="fa-solid fa-user-check"></i>}
          title="Candidate Hired"
          value={stats.totalCandidatesHired + ""}
        />
        <DashboardCard
          theme="red"
          icon={<i className="fa-solid fa-user-xmark"></i>}
          title="Candidate Rejected"
          value={stats.totalCandidatesRejected + ""}
        />
      </div>
    </section>
  );
};

export default Dashboard;
