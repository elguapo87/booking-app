"use client"

import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../../public/assets';
import Title from '@/components/Title';
import Image from 'next/image';
import { AppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { BookingData } from '@/types';

const DashboardPage = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("DashboardPage must be within AppContextProvider");
  const { axios, getToken, user, currency } = context;

  const [dashboardData, setDashboardData] = useState<BookingData | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get("/api/booking/getOwnerBookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setDashboardData(data.dashboardData);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        const errMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errMessage);
      }
    };

    fetchDashboardData();
  }, [user, axios, getToken]);

  return (
    <div>
      <Title
        title='Dashboard'
        subTitle='Monitor your room listings, track bookings and analyze revenue-all in one place.
                  Stay updated with real-time insights to ensure smooth operations.'
        align='left'
        font='outfit'
      />

      <div className='flex gap-4 my-8'>
        {/* TOTAL BOOKINGS */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
          <Image src={assets.totalBookingIcon} alt='' className='max-sm:hidden h-10' />
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Bookings</p>
            <p className='text-neutral-400 text-base'>{dashboardData?.totalBookings}</p>
          </div>
        </div>

        {/* TOTAL REVENUE */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
          <Image src={assets.totalRevenueIcon} alt='' className='max-sm:hidden h-10' />
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Revenue</p>
            <p className='text-neutral-400 text-base'>{currency} {dashboardData?.totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>

      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
            </tr>
          </thead>

          <tbody className='text-sm'>
            {dashboardData?.bookings?.map((item, index) => (
              <tr key={index}>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.user.username}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>{item.room.roomType}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>{currency} {item.totalPrice}</td>
                <td className='py-3 px-4 border-t border-gray-300 flex'>
                  <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid ? "bg-green-200 text-green-600" : "bg-amber-200 text-yellow-600"}`}>{item.isPaid ? "Completed" : "Pending"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardPage
