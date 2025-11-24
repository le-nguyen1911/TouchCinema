import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import dateFormat from "../../lib/dateFormat";

const ListShows = () => {
  const CURRENCY = import.meta.env.VITE_CURRENCY;
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllshows = async () => {
    try {
      setShows([
        {
          movie: dummyShowsData[0],
          showDateTime: "2025-07-24T01:00:00.000Z",
          showPrice: 59000,
          occupiedSeats: {
            A1: "us1",
            A2: "us2",
            A3: "us3",
          },
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllshows();
  }, []);
  return !loading ? (
    <>
      <Title text1={"Danh sách "} text2={"chương trình"} />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Tên phim</th>
              <th className="p-2 font-medium ">Thời gian phim</th>
              <th className="p-2 font-medium ">Tổng đặt vé</th>
              <th className="p-2 font-medium ">Tiền kiếm được</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {shows.map((item, index)=>(
              <tr key={index} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                <td className="p-2 min-w-45 pl-5">{item.movie.title}</td>
                <td className="p-2">{dateFormat(item.showDateTime)}</td>
                <td className="p-2">{Object.keys(item.occupiedSeats).length}</td>
                <td className="p-2">{Object.keys(item.occupiedSeats).length * item.showPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListShows;
