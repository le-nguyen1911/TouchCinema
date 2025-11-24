import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const { id, date } = useParams();
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const navigate = useNavigate();

  // Lấy dữ liệu phim
  const getshow = async () => {
    const movie = dummyShowsData.find((show) => show._id === id);
    if (movie) {
      setShow({ movie, datetime: dummyDateTimeData });
    }
  };

  // Xử lý chọn ghế
  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Vui lòng chọn thời gian trước!");
    }

    if (!selectedSeat.includes(seatId) && selectedSeat.length >= 10) {
      return toast(
        "Bạn chỉ được chọn tối đa 10 ghế mỗi lần! Vui lòng giao dịch nhiều lần hoặc liên hệ tại quầy."
      );
    }

    setSelectedSeat((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  // Render 1 hàng ghế
  const renderSeat = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`size-8 rounded border border-primary/60 cursor-pointer ${
                selectedSeat.includes(seatId) && "bg-primary text-white"
              }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  useEffect(() => {
    getshow();
  }, [id]);

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-medium px-6">Thời gian có sẵn</p>

        <div className="mt-5 space-y-1">
          {show?.datetime?.[date]?.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition-all duration-300 ${
                selectedTime?.time === item.time
                  ? "bg-primary text-white"
                  : "hover:bg-primary/20"
              }`}
            >
              <ClockIcon className="size-5" />
              <p className="text-sm">{isoTimeFormat(item.time)}</p>
            </div>
          )) || (
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
        <button onClick={()=>navigate("/my-booking")} className="bg-primary hover:bg-primary-dull rounded-full flex items-center gap-1 mt-20 px-10 py-3 text-md transition-all duration-300 font-medium cursor-pointer active:scale-95">
          Xử lý thanh toán
          <ArrowRightIcon strokeWidth={3} className="size-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
