import { NavLink, Outlet } from "react-router-dom";
import Header from "../../Header/Header";
import "./styles/layout.css";

const AdminLayout = () => {
  return (
    <>
      <Header />

      <div className="admin-layout">
        <nav className="admin-tabs">
          <NavLink to="dashboard">Dashboard</NavLink>
          <NavLink to="users">Users</NavLink>
          <NavLink to="candidates">Candidates</NavLink>
          <NavLink to="panels">Panels</NavLink>
          <NavLink to="mentors">Mentors</NavLink>
          <NavLink to="hr">HR</NavLink>
          <NavLink to="drives">Drives</NavLink>
        </nav>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
