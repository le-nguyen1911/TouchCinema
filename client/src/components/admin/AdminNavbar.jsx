import React from "react";
import LOGO from "../../assets/logo.png";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <div className="flex items-center justify-between px-6 md:px-10 h-16 border border-gray-300/20">
      <Link to="/">
        <img src={LOGO} alt="logo" className="w-36 h-auto" />
      </Link>
    </div>
  );
};

export default AdminNavbar;
