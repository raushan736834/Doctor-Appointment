import Header from "../component/UserComponent/Header";
import Footer from "../component/UserComponent/Footer";
import { Outlet } from "react-router-dom";

export default function UserLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children ?? <Outlet />}</main>
      <Footer />
    </>
  );
}