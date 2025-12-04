import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllComments, deleteComment } from "../../redux/commentSlice";
import { useAuth } from "@clerk/clerk-react";
import { StarIcon } from "lucide-react";
import toast from "react-hot-toast";

const ListComment = () => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { comments, loading } = useSelector((state) => state.comments);

  useEffect(() => {
    dispatch(fetchAllComments({ getToken }));
  }, []);

  const handleDelete = (id) => {
    if (!confirm("Bạn có chắc muốn xoá bình luận này?")) return;

    dispatch(deleteComment({ commentId: id, getToken })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Đã xoá bình luận!");
      } else {
        toast.error("Xoá thất bại!");
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Quản lý bình luận</h1>

      {loading && <p>Đang tải bình luận...</p>}

      <div className="overflow-x-auto border border-gray-700 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary/20 border-b text-white text-left">
              <th className="p-2">Người dùng</th>
              <th className="p-2">Phim</th>
              <th className="p-2">Nội dung</th>
              <th className="p-2">Số sao</th>
              <th className="p-2">Ngày</th>
              <th className="p-2 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {comments.map((c) => (
              <tr key={c._id} className="border-b bg-primary/5">
                <td className="p-2 flex items-center gap-2">
                  <img src={c.user?.image} className="w-8 h-8 rounded-full" />
                  {c.user?.name}
                </td>

                <td className="p-2">{c.movie?.title}</td>
                <td className="p-2 max-w-xs truncate">{c.comment}</td>

                <td className="p-2 flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon
                      key={s}
                      className={`size-4 ${
                        c.rating >= s
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-500"
                      }`}
                    />
                  ))}
                </td>

                <td className="p-2">
                  {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                </td>

                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white text-xs"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}

            {!loading && comments.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400 italic">
                  Không có bình luận nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListComment;
