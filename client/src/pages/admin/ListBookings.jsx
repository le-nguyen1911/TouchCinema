import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import dateFormat from '../../lib/dateFormat';

const ListBookings = () => {

  const CURRENCY = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([])
  const [isloading, setIsLoading] = useState(true)

  const getallbooking = async() =>{
    setBookings(dummyBookingData)
    setIsLoading(false)
  }
  useEffect(()=>{
    getallbooking()
  },[])
  return !isloading ? (
    <>
      <Title text1={"Danh sách"} text2={"đặt vé"} />
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
            <thead>
              <tr className='bg-primary/20 text-left text-white'>
                <th className='p-2 font-medium pl-5'>Tên người dùng</th>
                <th className='p-2 font-medium'>Tên phim</th>
                <th className='p-2 font-medium'>Giờ chiếu</th>
                <th className='p-2 font-medium'>Ghế ngồi</th>
                <th className='p-2 font-medium'>Giá tiền</th>
              </tr>
            </thead>
            <tbody className='text-sm font-light'>
              {bookings.map((item, index)=>(
                <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10'>
                  <td className='p-2 min-w-45 pl-5'>{item.user.name}</td>
                  <td className='p-2'>{item.show.movie.title}</td>
                  <td className='p-2'>{dateFormat(item.show.showDateTime)}</td>
                  <td className='p-2'>{Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")}</td>
                  <td className='p-2'>{item.amount.toLocaleString()}{CURRENCY}</td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </>
  ): <Loading />
}

export default ListBookings
