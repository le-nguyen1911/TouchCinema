import React, { useEffect } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchIsAdmin } from "../../redux/adminSlice";
import Loading from "../../components/Loading";
import { useAuth } from "@clerk/clerk-react";

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const { isAdmin } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchIsAdmin({ getToken, location, navigate }));
  }, []);

  return isAdmin ? (
    <>
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh - 64px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Layout;
