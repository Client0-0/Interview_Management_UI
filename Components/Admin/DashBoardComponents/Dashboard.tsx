import React, { useEffect, useState } from "react";
import './Styles/hirehub.css';
import { getDashboardStats } from "../../../Services/Admin.Service";
import type { DashboardStats } from "../../../Models/user";
//import Header from "../../Header/Header";

interface StatCardProps {
  icon: React.ReactNode;   // FIXED HERE
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <div className="stat-card">
    <div className="icon">{icon}</div>
    <div className="content">
      <p className="title">{title}</p>
      <h2 className="value1">{value}</h2>
    </div>
  </div>
);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  if (!stats) return <p>No data available</p>;
  return (
    <section className="dashboard">
      

      <div className="stats-grid">
        <StatCard
          icon={<i className="fa-solid fa-users icon-blue" ></i>}
          title="Total Users"
          value={stats.totalUsers+""}
        />
        <StatCard
          icon={<i className="fa-solid fa-user-graduate icon-green" ></i>}
          title="Total Candidates"
          value={stats.totalCandidates+""}
        />
        <StatCard
          icon={<i className="fa-solid fa-gavel icon-cyan"></i>}
          title="Panel Members"
          value={stats.totalPanelMembers+""} 
        />
        <StatCard
          icon={<i className="fa-solid fa-compass icon-orange"></i>}
          title="Mentors/Coordinators"
          value={stats.totalMentors+""}
        />
        <StatCard
          icon={<i className="fa-solid fa-calendar-day icon-red"></i>}
          title="Interviews"
          value={stats.totalInterviews+""}
        />
        <StatCard
          icon={<i className="fa-solid fa-users-gear icon-grey"></i>}
          title="Human Resources"
          value={stats.totalHrs+""}
        />
         <StatCard
          icon={<i className="fa-solid fa-user-check icon-green"></i>}
          title="Candidate Hired"
          value={stats.totalCandidatesHired+""}
        />
        <StatCard
          icon={<i className="fa-solid fa-user-slash icon-red"></i>}
          title="Candidate Rejected"
         value={stats.totalCandidatesRejected+""}
        />
      </div>
    </section>
  );
};

export default Dashboard;
