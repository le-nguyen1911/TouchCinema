import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <CheckCircle size={80} className="text-green-500 mb-4" />

      <h1 className="text-3xl font-bold mb-3">Thanh toán thành công!</h1>

      <p className="text-gray-400 text-lg max-w-md">
        Cảm ơn bạn đã thanh toán. Vé của bạn đã được xác nhận trong hệ thống.
      </p>

      <div className="flex gap-4 mt-8">
        <Link
          to="/my-booking"
          className="bg-primary px-6 py-3 rounded-full text-white font-medium"
        >
          Xem vé của tôi
        </Link>

        <Link
          to="/"
          className="bg-gray-200 px-6 py-3 rounded-full text-gray-700 font-medium"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
