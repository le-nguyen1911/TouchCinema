import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { dummyBookingData } from "../assets/assets";
import timeFormat from "../lib/timeFormat";
import dateFormat from "../lib/dateFormat";

const MyBooking = () => {
  const CURRENCY = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBooking = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  };
  useEffect(() => {
    getMyBooking();
  }, []);
  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0" left="600px" />
      </div>
      <h1 className="text-lg font-semibold mb-4">Lịch sử mua vé</h1>
      {bookings.map((item, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl"
        >
          <div className="flex flex-col md:flex-row ">
            <img
              src={item.show.movie.poster_path}
              alt=""
              className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
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
              <p className="text-2xl font-semibold mb-3">
                {item.amount.toLocaleString("vi-VN")}
                {CURRENCY}
              </p>

              {!item.isPaid && (
                <button className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer">
                  Thanh toán ngay
                </button>
              )}
            </div>
            <div className="text-sm">
                <p><span className="text-gray-400">Tổng vé: </span>{item.bookedSeats.length}</p>
                <p><span className="text-gray-400">Số ghế: </span>{item.bookedSeats.join(", ")}</p>
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
