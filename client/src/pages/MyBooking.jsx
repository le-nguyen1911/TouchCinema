import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  cancelBooking,
  createVnpayPayment,
  fetchMyBookings,
} from "../redux/bookingSlice";

import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import dateFormat from "../lib/dateFormat";
import { image_base_url } from "../redux/showSlice";
import toast from "react-hot-toast";

const MyBooking = () => {
  const CURRENCY = import.meta.env.VITE_CURRENCY;

  const { user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const { myBookings, loading } = useSelector((state) => state.booking);

  const [bookingToDelete, setBookingToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyBookings({ getToken }));
    }
  }, [user]);

  const handlePayment = async (bookingId) => {
    try {
      const paymentUrl = await dispatch(
        createVnpayPayment({ bookingId, getToken })
      ).unwrap();

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error("Không tạo được link thanh toán");
      }
    } catch (err) {
      toast.error(err?.message || "Thanh toán thất bại");
    }
  };

  const confirmCancel = async () => {
    try {
      await dispatch(cancelBooking({ bookingId: bookingToDelete, getToken })).unwrap();
      toast.success("Hủy vé thành công!");
      setBookingToDelete(null);
    } catch (err) {
      toast.error(err?.message || "Hủy vé thất bại");
    }
  };

  return !loading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0" left="600px" />

      <h1 className="text-lg font-semibold mb-4">Lịch sử mua vé</h1>

      {myBookings.map((item) => (
        <div
          key={item._id}
          className="flex flex-col md:flex-row justify-between bg-primary/8 
          border border-primary/20 rounded-lg mt-4 p-2 max-w-4xl"
        >
          <div className="flex flex-col md:flex-row">
            <img
              src={image_base_url + item.show.movie.poster_path}
              alt=""
              className="md:max-w-45 aspect-video h-auto object-cover rounded"
            />

            <div className="flex flex-col p-4">
              <p className="text-lg font-semibold">{item.show.movie.title}</p>
              <p className="text-gray-400 text-sm">
                {timeFormat(item.show.movie.runtime)}
              </p>
              <p className="text-gray-400 text-sm mt-auto">
                {dateFormat(item.show.showDateTime)}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end md:text-right justify-between p-4">
            <div className="flex items-center gap-4">
              <p className="text-xl font-semibold mb-3">
                {item.amount.toLocaleString("vi-VN")}
                {CURRENCY}
              </p>

              {!item.isPaid && (
                <button
                  onClick={() => handlePayment(item._id)}
                  className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer"
                >
                  Thanh toán ngay
                </button>
              )}

              {!item.isPaid && (
                <button
                  onClick={() => setBookingToDelete(item._id)}
                  className="text-red-500 hover:text-red-700 text-sm underline cursor-pointer mb-3"
                >
                  Hủy đặt vé
                </button>
              )}
            </div>

            <div className="text-sm">
              <p>
                <span className="text-gray-400">Tổng vé: </span>
                {item.bookedSeats.length}
              </p>

              <p>
                <span className="text-gray-400">Số ghế: </span>
                {item.bookedSeats.join(", ")}
              </p>
            </div>
          </div>
        </div>
      ))}



      {bookingToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Xác nhận hủy vé</h2>
            <p className="text-gray-600 mb-6">Bạn có chắc muốn hủy vé này không?</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setBookingToDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Không
              </button>

              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Hủy vé
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default MyBooking;
