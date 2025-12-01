import React from "react";
import { assets } from "../../assets/assets";
import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
  UserIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const user = {
    firstName: "admin",
    lastName: "user",
    imageUrl: assets.profile,
  };

  const adminNavlink = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Thêm suất chiếu", path: "/admin/add-show", icon: PlusSquareIcon },
    { name: "Danh sách suất chiếu", path: "/admin/list-show", icon: ListIcon },
    { name: "Danh sách đặt vé", path: "/admin/list-booking", icon: ListCollapseIcon },
    { name: "Danh sách người dùng", path: "/admin/list-users", icon: UserIcon },
  ];

  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-md">
      <img
        className="size-9 md:size-14 rounded-full mx-auto"
        src={user.imageUrl}
        alt="sidebar"
      />

      <p className="mt-2 text-base max-md:hidden">
        {user.firstName} {user.lastName}
      </p>

      <div className="w-full">
        {adminNavlink.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end
            className={({ isActive }) =>
              `relative flex items-center gap-3 w-full py-2.5 pl-10 text-gray-400 ${
                isActive ? "bg-primary/15 text-primary" : ""
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="size-5" />
                <p className="max-md:hidden">{item.name}</p>

                <span
                  className={`w-2 h-10 rounded-l absolute right-0 ${
                    isActive ? "bg-primary" : ""
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
