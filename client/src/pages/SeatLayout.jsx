import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchShowById } from "../redux/showSlice";
import { bookTickets, fetchOccupiedSeats } from "../redux/bookingSlice";
import { useAuth, useUser } from "@clerk/clerk-react";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const { id, date } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useUser();
  const { getToken } = useAuth();

  const { singleShow } = useSelector((state) => state.show);
  const { occupiedSeats, loading } = useSelector((state) => state.booking);

  const [selectedSeat, setSelectedSeat] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  /* -------------------------
      FETCH SHOW
  ------------------------- */
  useEffect(() => {
    dispatch(fetchShowById({ id }));
  }, [id]);

  /* -------------------------
      FETCH OCCUPIED SEATS
      Khi chọn giờ chiếu
  ------------------------- */
  useEffect(() => {
    if (selectedTime?.showId) {
      dispatch(
        fetchOccupiedSeats({
          showId: selectedTime.showId,
          getToken,
        })
      );
    }
  }, [selectedTime]);

  if (!singleShow) return <Loading />;

  const movie = singleShow.movie;
  const datetime = singleShow.dateTime;

  const occupied = occupiedSeats || [];

  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast("Vui lòng chọn thời gian trước!");

    if (occupied.includes(seatId)) {
      return toast.error("Ghế này đã được đặt!");
    }

    if (!selectedSeat.includes(seatId) && selectedSeat.length >= 10) {
      return toast.error("Tối đa 10 ghế mỗi lần!");
    }

    setSelectedSeat((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };
  /* -------------------------
   HANDLE BOOKING TICKETS
-------------------------- */
  const handleBooking = async () => {
    if (!selectedTime) return toast.error("Vui lòng chọn thời gian!");
    if (selectedSeat.length === 0) return toast.error("Bạn chưa chọn ghế!");

    try {
      const result = await dispatch(
        bookTickets({
          getToken,
          showId: selectedTime.showId,
          seats: selectedSeat,
        })
      );

      if (bookTickets.fulfilled.match(result)) {
        toast.success("Đặt ghế thành công!");
        navigate("/my-booking");
      } else {
        toast.error(result.payload || "Đặt ghế thất bại!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi.");
    }
  };

  /* -------------------------
      RENDER SEAT
  ------------------------- */
  const renderSeat = (row, count = 10) => (
    <div key={row} className="flex gap-2 mt-2">
      {Array.from({ length: count }, (_, i) => {
        const seatId = `${row}${i + 1}`;
        const isSelected = selectedSeat.includes(seatId);
        const isOccupied = occupied.includes(seatId);

        return (
          <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            disabled={isOccupied}
            className={`
            h-8 w-8 rounded border flex items-center justify-center
            transition-all duration-200 border-primary/60

            ${isSelected ? "bg-primary text-white scale-105" : ""}
            ${
              isOccupied
                ? "bg-gray-500 text-white opacity-60 cursor-not-allowed"
                : ""
            }
          `}
          >
            {seatId}
          </button>
        );
      })}
    </div>
  );
  console.log("UI nhận occupiedSeats:", occupied);
  console.log("Ghế đang chọn:", selectedSeat);
  console.log("SelectedTime:", selectedTime);

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-medium px-6">Thời gian có sẵn</p>

        <div className="mt-5 space-y-1">
          {datetime && datetime[date] && datetime[date].length > 0 ? (
            datetime[date].map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition-all duration-300 
                  ${
                    selectedTime?.time === item.time
                      ? "bg-primary text-white"
                      : "hover:bg-primary/20"
                  }`}
              >
                <ClockIcon className="size-5" />
                <p className="text-sm">{item.time}</p>
              </div>
            ))
          ) : (
            <p className="px-6 text-sm text-gray-400">Không có suất chiếu</p>
          )}
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />

        <h1 className="text-2xl font-semibold mb-4">Chọn chỗ ngồi của bạn</h1>
        <img src={assets.screenImage} alt="" />
        <p className="text-gray-400 text-sm mb-6">MÀN HÌNH</p>

        <div className="flex flex-col items-center mt-10 text-md text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeat(row))}
          </div>

          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeat(row))}</div>
            ))}
          </div>
        </div>

        <button
          onClick={handleBooking}
          disabled={loading}
          className="bg-primary hover:bg-primary-dull rounded-full flex items-center gap-1 mt-20 px-10 py-3 text-md transition-all duration-300 font-medium cursor-pointer active:scale-95 disabled:opacity-50"
        >
          Đặt ghế
          <ArrowRightIcon strokeWidth={3} className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default SeatLayout;
