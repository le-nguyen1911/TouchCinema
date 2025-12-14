import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  UserIcon,
  StarIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";

import dateFormat from "../../lib/dateFormat";
import { fetchDashboardData, image_base_url } from "../../redux/adminSlice";

import { useAuth, useUser } from "@clerk/clerk-react";
import { deleteShow, updateShow } from "../../redux/showSlice";
import toast from "react-hot-toast";
const Dashboard = () => {
  const CURRENCY = import.meta.env.VITE_CURRENCY;

  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { user } = useUser();

  const { dashboardData, loadingDashboard } = useSelector(
    (state) => state.admin
  );

  const [selectedShow, setSelectedShow] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(fetchDashboardData({ getToken }));
    }
  }, [user]);

  if (loadingDashboard || !dashboardData) return <Loading />;

  const dashboardCards = [
    {
      title: "Tổng vé đã đặt",
      value: dashboardData.totalBookings ?? "0",
      icon: ChartLineIcon,
    },
    {
      title: "Tổng Doanh thu",
      value:
        (dashboardData.totalRevenue ?? 0).toLocaleString() + " " + CURRENCY,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Chương trình hoạt động",
      value: dashboardData.activeShows.length ?? "0",
      icon: PlayCircleIcon,
    },
    {
      title: "Người dùng",
      value: dashboardData.totalUser ?? "0",
      icon: UserIcon,
    },
  ];

  const handleUpdateShow = () => {
    if (!selectedShow) return;

    dispatch(
      updateShow({
        getToken,
        showId: selectedShow._id,
        showPrice: Number(editPrice),
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success(data.message);
        setSelectedShow(null);
        dispatch(fetchDashboardData({ getToken }));
        
      } else {
        toast.error("Cập nhật thất bại!");
      }
    });
    window.location.reload();
  };

  const handleDeleteShow = (showId) => {
    if (!confirm("Bạn chắc chắn muốn xóa suất chiếu này?")) return;

    dispatch(deleteShow({ getToken, showId })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Đã xóa thành công!");
        dispatch(fetchDashboardData({ getToken }));
      } else {
        toast.error("Xóa thất bại!");
      }
    });
  };

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />

      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0" />

        <div className="flex flex-wrap gap-4 w-full">
          {dashboardCards.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full"
            >
              <div>
                <h1 className="text-lg">{item.title}</h1>
                <p className="text-xl font-medium mt-2">{item.value}</p>
              </div>
              <item.icon className="size-6" />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-lg font-medium">Chương trình hoạt động</p>

      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
        <BlurCircle top="100px" left="-10%" />

        {dashboardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="w-55 rounded-lg overflow-hidden bg-primary/30 border border-primary/20 hover:-translate-y-1 transition-all duration-300 pb-4 relative"
          >
            <img
              src={image_base_url + show.movie.poster_path}
              className="h-60 w-full object-cover"
            />

            <p className="font-medium p-2 truncate">{show.movie.title}</p>

            <div className="flex items-center justify-between px-2">
              <p className="text-lg font-medium">
                {show.showPrice.toLocaleString()} {CURRENCY}
              </p>

              <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                <StarIcon className="size-5 text-primary fill-primary" />
                {show.movie.vote_average.toFixed(1)}
              </p>
            </div>

            <p className="px-2 pt-1 text-sm text-gray-400">
              {dateFormat(show.showDateTime)}
            </p>

            <div className="flex justify-end gap-3 px-3 mt-2">
              <button
                onClick={() => {
                  setSelectedShow(show);
                  setEditPrice(show.showPrice);
                }}
                className="text-yellow-400 hover:text-yellow-500"
              >
                <PencilIcon size={20} />
              </button>

              <button
                onClick={() => handleDeleteShow(show._id)}
                className="text-red-500 hover:text-red-600"
              >
                <TrashIcon size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedShow && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 w-80 p-5 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold mb-3">
              Chỉnh sửa giá vé – {selectedShow.movie.title}
            </h2>

            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedShow(null)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Hủy
              </button>

              <button
                onClick={handleUpdateShow}
                className="px-4 py-2 bg-primary text-black rounded hover:bg-primary/80"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
