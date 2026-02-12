import { Outlet } from "react-router-dom";
import Header from "../../Header/Header";

const HRLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

export default HRLayout;
