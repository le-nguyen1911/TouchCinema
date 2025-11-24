import React from "react";
import { assets } from "../assets/assets";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Heromovies = () => {
    const navigate = useNavigate()
  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/src//assets//backgroundImage.png")] bg-cover bg-center h-screen'>
      <img src={assets.marvelLogo} className="max-h-11 lg:h-11 mt-20" alt="" />
      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
        Những người bảo vệ <br /> Thiên hà
      </h1>
      <div className="flex items-center gap-4 text-gray-300">
        <span>Hành động | Thám hiểm | Khoa học viễn tưởng</span>
        <div className="flex items-center gap-1 ">
          <CalendarIcon className="size-4.5" />
          2025
        </div>
        <div className="flex items-center gap-1 ">
          <ClockIcon className="size-4.5" />
          2h 18m
        </div>
      </div>
      <p className="max-w-md text-gray-300">
        Thế giới đã sụp đổ. Trên những bánh xe khổng lồ, các thành phố truy đuổi
        và nuốt chửng lẫn nhau để sống sót. Nhưng tại London, hai con người mang
        số phận đối lập sẽ bước vào cuộc chiến chống lại một bí mật có thể thay
        đổi tương lai nhân loại.
      </p>
      <button onClick={()=>navigate("/movie")} className="flex items-center gap-1 px-6 py-3 bg-primary hover:bg-primary-dull transition rounded-full">
        Khám phá ngay
        <ArrowRight className="size-5" />
      </button>
    </div>
  );
};

export default Heromovies;
