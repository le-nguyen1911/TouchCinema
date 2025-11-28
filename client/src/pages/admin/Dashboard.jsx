import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import dateFormat from "../../lib/dateFormat";
import { fetchDashboardData, image_base_url } from "../../redux/adminSlice";
import { useAuth, useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const CURRENCY = import.meta.env.VITE_CURRENCY;
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const {user} = useUser()
  const { dashboardData, loadingDashboard } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    if(user){
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
            className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/30 border border-primary/20 hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={image_base_url + show.movie.poster_path}
              alt="poster"
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

            <p className="px-2 pt-2 text-sm text-gray-500">
              {dateFormat(show.showDateTime)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
