import React, { useState } from "react";
import BlurCircle from "./BlurCircle";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DateSelect = ({ datetime, id }) => {

    const navigate = useNavigate()
    const [selected, setSelected] = useState(null)

    const onBookhandler =()=>{
        if(!selected){
            return toast('Vui lòng chọn ngày')
        }
        navigate(`/movie/${id}/${selected}`)
        scrollTo(0,0)
    }
  return (
    <div className="pt-30" id="dateSelect">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="-100px" right="-100px" />
        <div>
          <p className="text-lg font-semibold">Chọn ngày</p>
          <div className="flex items-center gap-6 text-sm mt-5">
            <ChevronLeftIcon width={28} />
            <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
              {Object.keys(datetime ?? {}).map((date) => {
                const d = new Date(date);

                return (
                  <button
                  onClick={()=>setSelected(date)}
                    key={date}
                    className={`flex flex-col items-center justify-center size-14 aspect-square rounded cursor-pointer hover:bg-primary/20 transition ${selected=== date ? "bg-primary text-white": "border border-primary/70"}`}
                  >
                    <span>{d.getDate()}</span>
                    <span>
                      {d.toLocaleDateString("vi-VN", {
                        month: "short",
                      })}
                    </span>
                  </button>
                );
              })}
            </span>

            <ChevronRightIcon width={28} />
          </div>
        </div>
        <button onClick={onBookhandler} className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary-dull transition-all duration-300 cursor-pointer">
          Đặt ngay
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
