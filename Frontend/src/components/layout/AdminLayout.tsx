import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <aside>Admin Sidebar</aside>
      <Outlet />
    </div>
  );
};

export default AdminLayout;