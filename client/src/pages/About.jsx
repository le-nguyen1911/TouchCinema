import React from "react";

const About = () => {
  return (
    <div className="w-full min-h-screen text-white bg-[#0a0f1f] ">

      <div
        className="w-full h-[70vh] bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://quangcaongoaitroi.com/wp-content/uploads/2020/04/hinh-thuc-quang-cao-tai-rap-chieu-phim-2.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            HỆ THỐNG CHIẾU PHIM HIỆN ĐẠI
          </h1>

          <p className="text-gray-200 max-w-4xl leading-relaxed">
            <span className="font-bold text-lg">TouchCinema</span> là một trong những hệ thống rạp chiếu phim hiện đại, mang
            đến trải nghiệm giải trí đỉnh cao với nhiều mô hình dịch vụ hấp dẫn.
          </p>
        <p>
          Các phòng chiếu hiện đại, ghế ngồi cao cấp, màn hình độ phân giải cao,
          âm thanh Dolby Atmos sống động, mang đến trải nghiệm điện ảnh tuyệt vời.
        </p>

        <p className="mt-4">
          Với mục tiêu trở thành điểm đến giải trí cho mọi gia đình Việt Nam,
          TouchCinema đang từng bước phát triển để đem đến những dịch vụ tốt nhất,
          chất lượng nhất cho khán giả trên toàn quốc.
        </p>

        <p className="mt-4">
          Không chỉ chiếu các bộ phim bom tấn quốc tế, TouchCinema còn đồng hành
          cùng điện ảnh Việt Nam để mang đến cho khán giả những tác phẩm đậm đà bản sắc.
        </p>
        </div>
      </div>


      <div className="py-12 bg-[#0d1326]">
        <h2 className="text-center text-3xl font-bold mb-10">SỨ MỆNH</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-20 lg:px-40">
          
          <div className=" from-[#1c2440] to-[#11182e] border border-white/10 rounded-xl p-6 text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-primary">01</h3>
            <p className="text-gray-300">
              Góp phần phát triển điện ảnh Việt Nam, văn hóa và giải trí cho người Việt.
            </p>
          </div>

          <div className=" from-[#1c2440] to-[#11182e] border border-white/10 rounded-xl p-6 text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-primary">02</h3>
            <p className="text-gray-300">
              Mang đến dịch vụ tốt nhất với mức giá hợp lý, phù hợp thu nhập người Việt.
            </p>
          </div>

          <div className=" from-[#1c2440] to-[#11182e] border border-white/10 rounded-xl p-6 text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-primary">03</h3>
            <p className="text-gray-300">
              Mang nghệ thuật điện ảnh quốc tế và Việt Nam đến gần khán giả hơn.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default About;
