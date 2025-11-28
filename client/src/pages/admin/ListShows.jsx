import React, { useEffect } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import dateFormat from "../../lib/dateFormat";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminAllShows } from "../../redux/adminSlice";
import { useAuth, useUser } from "@clerk/clerk-react";

const ListShows = () => {
  const CURRENCY = import.meta.env.VITE_CURRENCY;

  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { adminShows, loadingAdminShows } = useSelector((state) => state.admin);

  useEffect(() => {
    if (user) {
      dispatch(fetchAdminAllShows({ getToken }));
    }
  }, [user]);

  return loadingAdminShows ? (
    <Loading />
  ) : (
    <>
      <Title text1={"Danh sách "} text2={"chương trình"} />

      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Tên phim</th>
              <th className="p-2 font-medium">Thời gian chiếu</th>
              <th className="p-2 font-medium">Tổng đặt vé</th>
              <th className="p-2 font-medium">Tiền kiếm được</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {adminShows.map((item) => (
              <tr
                key={item._id}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 min-w-45 pl-5">{item.movie.title}</td>

                <td className="p-2">{dateFormat(item.showDateTime)}</td>

                <td className="p-2">
                  {Object.keys(item.occupiedSeats).length}
                </td>

                <td className="p-2">
                  {(Object.keys(item.occupiedSeats).length * item.showPrice).toLocaleString("vi-VN")}{" "}
                  {CURRENCY}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListShows;
