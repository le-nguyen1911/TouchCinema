import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <XCircle size={80} className="text-red-500 mb-4" />

      <h1 className="text-3xl font-bold mb-3">Thanh toán thất bại</h1>

      <p className="text-gray-400 text-lg max-w-md">
        Giao dịch không thành công. Bạn vui lòng thử lại.
      </p>

      <Link
        to="/my-booking"
        className="bg-primary px-6 py-3 mt-6 rounded-full text-white font-medium"
      >
        Quay lại lịch sử vé
      </Link>
    </div>
  );
};

export default PaymentFailed;
