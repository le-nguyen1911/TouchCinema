import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/userSlice";
import { useAuth } from "@clerk/clerk-react";

const ListUser = () => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const { loading, list, error, total } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers({ limit: 50, offset: 0, getToken }));
  }, [dispatch, getToken]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Danh sách người dùng</h1>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto border border-gray-700 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-primary/20 text-left text-white">
              <th className="p-2">ID</th>
              <th className="p-2">Email</th>
              <th className="p-2">Tên</th>
                </tr>
          </thead>

          <tbody className="text-sm font-light">
            {list.map((user) => (
              <tr
                key={user.id}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 font-mono text-xs">{user.id}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.name}</td>
              </tr>
            ))}

            {list.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-gray-400 italic"
                >
                  Chưa có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-gray-400">Tổng cộng: {total} users</p>
    </div>
  );
};

export default ListUser;
