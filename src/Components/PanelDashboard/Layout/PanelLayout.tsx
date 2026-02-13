import { Outlet } from "react-router-dom";
import Header from "../../Header/Header";

const PanelLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

export default PanelLayout;
