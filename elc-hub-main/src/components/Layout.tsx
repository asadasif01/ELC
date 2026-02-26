import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1 pt-[var(--nav-height)]">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
