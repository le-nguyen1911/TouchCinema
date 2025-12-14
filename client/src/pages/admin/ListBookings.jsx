import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import dateFormat from "../../lib/dateFormat";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminAllBookings } from "../../redux/adminSlice";
import { useAuth, useUser } from "@clerk/clerk-react";
import { cancelBooking, updateBookingByAdmin } from "../../redux/bookingSlice";
import toast from "react-hot-toast";

const ListBookings = () => {
  const CURRENCY = import.meta.env.VITE_CURRENCY;
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const [bookingToDelete, setBookingToDelete] = useState(null);
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { adminBookings, loadingAdminBookings } = useSelector(
    (state) => state.admin
  );
  const confirmCancel = async () => {
    try {
      await dispatch(
        cancelBooking({ bookingId: bookingToDelete, getToken })
      ).unwrap();

      toast.success("Hủy vé thành công!");

      window.location.reload();
    } catch (err) {
      toast.error(err?.message || "Hủy vé thất bại");
    }
  };

  const handleTogglePaid = async (bookingId, checked) => {
    try {
      await dispatch(
        updateBookingByAdmin({
          bookingId,
          isPaid: checked,
          getToken,
        })
      ).unwrap();

      // 🔥 LOAD LẠI DANH SÁCH NGAY
      dispatch(fetchAdminAllBookings({ getToken }));

      toast.success(
        checked ? "Đã đánh dấu thanh toán" : "Đã chuyển về chưa thanh toán"
      );
    } catch (err) {
      toast.error(err?.message || "Cập nhật thanh toán thất bại");
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchAdminAllBookings({ getToken }));
    }
  }, [user]);
  const filteredBookings = adminBookings.filter((item) => {
    if (paymentFilter === "paid" && !item.isPaid) return false;
    if (paymentFilter === "unpaid" && item.isPaid) return false;

    if (dateFilter) {
      const showDate = new Date(item.show.showDateTime)
        .toISOString()
        .split("T")[0];

      if (showDate !== dateFilter) return false;
    }

    return true;
  });

  return !loadingAdminBookings ? (
    <>
      <Title text1="Danh sách" text2="đặt vé" />
      <div className="flex flex-wrap gap-4 mt-4 items-center">
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-sm"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="paid">Đã thanh toán</option>
          <option value="unpaid">Chưa thanh toán</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-sm"
        />

        <button
          onClick={() => {
            setPaymentFilter("all");
            setDateFilter("");
          }}
          className="px-4 py-2 text-sm bg-primary text-black rounded"
        >
          Reset lọc
        </button>
      </div>

      <div className="max-w-6xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Tên người dùng</th>
              <th className="p-2 font-medium">Tên phim</th>
              <th className="p-2 font-medium">Giờ chiếu</th>
              <th className="p-2 font-medium">Ghế ngồi</th>
              <th className="p-2 font-medium">Giá tiền</th>
              <th className="p-2 font-medium">Thanh toán</th>
              <th className="p-2 font-medium">Hành động</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {filteredBookings?.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/20 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 min-w-45 pl-5">{item.user?.name}</td>

                <td className="p-2">{item.show.movie.title}</td>

                <td className="p-2">{dateFormat(item.show.showDateTime)}</td>

                <td className="p-2">{item.bookedSeats.join(", ")}</td>

                <td className="p-2">
                  {item.amount.toLocaleString()} {CURRENCY}
                </td>
                <td className="p-2">
                  <select
                    value={item.isPaid ? "paid" : "unpaid"}
                    onChange={(e) =>
                      handleTogglePaid(item._id, e.target.value === "paid")
                    }
                    className={`px-3 py-1.5 rounded-md text-sm font-medium border 
      focus:outline-none cursor-pointer
      ${
        item.isPaid
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300"
      }`}
                  >
                    <option value="paid">🟢 Đã thanh toán</option>
                    <option value="unpaid">🔴 Chưa thanh toán</option>
                  </select>
                </td>

                <td className="p-2 text-center cursor-pointer">
                  {item.isPaid ? (
                    "🟢"
                  ) : (
                    <span
                      className="text-red-500"
                      onClick={() => setBookingToDelete(item._id)}
                    >
                      Hủy vé
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookingToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-80 text-center">
              <h2 className="text-lg font-semibold mb-4">Xác nhận hủy vé</h2>
              <p className="text-gray-600 mb-6">
                Bạn có chắc muốn hủy vé này không?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setBookingToDelete(null)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Không
                </button>

                <button
                  onClick={confirmCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Hủy vé
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListBookings;
