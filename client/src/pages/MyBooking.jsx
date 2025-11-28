import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-react";
import { createVnpayPayment, fetchMyBookings } from "../redux/bookingSlice";

import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import dateFormat from "../lib/dateFormat";
import { image_base_url } from "../redux/showSlice";

const MyBooking = () => {
  const CURRENCY = import.meta.env.VITE_CURRENCY;

  const { user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const { myBookings, loading } = useSelector((state) => state.booking);

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
  return !loading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0" left="600px" />

      <h1 className="text-lg font-semibold mb-4">Lịch sử mua vé</h1>

      {myBookings.map((item, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row justify-between bg-primary/8 
          border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl"
        >
          {/* Left: movie info */}
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

          {/* Right: seats and price */}
          <div className="flex flex-col md:items-end md:text-right justify-between p-4">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold mb-3">
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
    </div>
  ) : (
    <Loading />
  );
};

export default MyBooking;
