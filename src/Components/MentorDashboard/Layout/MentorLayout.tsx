import { Outlet } from "react-router-dom";
import Header from "../../Header/Header";

const MentorLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

export default MentorLayout;
