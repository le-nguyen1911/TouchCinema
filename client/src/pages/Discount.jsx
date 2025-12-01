import React from "react";
import { Link } from "react-router-dom";

const promotions = [
  {
    title: "C’SCHOOL – ƯU ĐÃI GIÁ VÉ CHỈ TỪ 45K DÀNH CHO HỌC SINH / SINH VIÊN",
    image:
      "https://api-website.cinestar.com.vn/media/wysiwyg/CMSPage/Promotions/HSSV-2.jpg",
    button: "Đặt vé ngay",
    content: [
      "Giá vé ưu đãi chỉ từ 45.000đ – 50.000đ vào Thứ 2 đến Thứ 6.",
      "Áp dụng cho học sinh, sinh viên từ 13 đến 22 tuổi (yêu cầu xuất trình thẻ).",
      "Phòng chiếu 2D tiêu chuẩn – màn hình sáng, âm thanh sống động.",
      "Combo bắp nước ưu đãi chỉ từ 39.000đ khi mua kèm vé.",
      "Áp dụng tại toàn bộ hệ thống TouchCinema.",
    ],
    note: [
      "Khách hàng phải xuất trình thẻ học sinh – sinh viên hợp lệ.",
      "Mỗi thẻ được mua tối đa 2 vé/ngày.",
      "Không áp dụng vào ngày Lễ, Tết hoặc suất chiếu đặc biệt.",
    ],
  },
  {
    title: "HAPPY HOUR – VÉ 45K TỪ 22:00 ĐẾN 10:00",
    image:
      "https://api-website.cinestar.com.vn/media/wysiwyg/CMSPage/Promotions/C_TEN.jpg",
    button: "Đặt vé ngay",
    content: [
      "Giá vé siêu ưu đãi chỉ từ 45.000đ cho tất cả khách hàng.",
      "Áp dụng từ 22:00 hôm trước đến 10:00 sáng hôm sau.",
      "Trải nghiệm phim khuya – yên tĩnh, phòng chiếu thoáng, cực chill.",
      "Giảm thêm 10% cho thành viên TouchCinema khi thanh toán online.",
    ],
    note: [
      "Không áp dụng cho phòng chiếu VIP, ghế đôi hoặc giường nằm.",
      "Không áp dụng vào ngày Lễ, Tết.",
    ],
  },
];

const Discount = () => {
  return (
    <div className="min-h-screen px-6 md:px-20 lg:px-40 py-16 bg-[#0a0f1f] text-white">
      <h1 className="text-center text-3xl font-bold text-primary mb-12 mt-8">
        KHUYẾN MÃI & ƯU ĐÃI
      </h1>

      <div className="space-y-24">
        {promotions.map((promo, index) => (
          <div
            key={index}
            className="bg-[#10172b] border border-white/10 rounded-xl p-6 md:p-10 
            flex flex-col md:flex-row gap-10 shadow-lg"
          >
            <div className="md:w-1/2 flex justify-center">
              <img
                src={promo.image}
                alt=""
                className="rounded-lg w-full max-w-[420 shadow-lg"
              />
            </div>

            <div className="md:w-1/2">
              <h2 className="text-xl md:text-2xl font-bold mb-4 leading-snug">
                {promo.title}
              </h2>

              <ul className="space-y-2 text-gray-300 leading-relaxed mb-6">
                {promo.content.map((line, i) => (
                  <li key={i}>• {line}</li>
                ))}
              </ul>

              <h3 className="text-primary font-semibold mb-2">Lưu ý:</h3>
              <ul className="text-gray-400 text-sm space-y-1 mb-6">
                {promo.note.map((line, i) => (
                  <li key={i}>– {line}</li>
                ))}
              </ul>

              <button className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-md text-sm font-medium shadow-md">
                <Link
                  to="/movie"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  {promo.button}
                </Link>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discount;
