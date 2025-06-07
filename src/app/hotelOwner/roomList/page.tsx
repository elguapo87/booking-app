"use client"

import { useState } from "react"
import { roomsDummyData } from "../../../../public/assets"
import Title from "@/components/Title";

const RoomListPage = () => {

  const [rooms, setRooms] = useState(roomsDummyData);

  return (
    <div>
      <Title
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
        align="left"
        font="outfit"
      />

      <p className="text-gray-500 mt-8">All Rooms</p>

      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
              <th className='py-3 px-4 text-gray-800 font-medium'>Price / night</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {rooms.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">{item.roomType}</td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">{item.amenities.join(", ")}</td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">{item.pricePerNight}</td>
                <td className="py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center">
                  <label className="relative inline-flex items-center cursor-pointer w-12 h-7">
                    {/* Hidden Checkbox as Peer */}
                    <input
                      type="checkbox"
                      checked={item.isAvailable}
                      onChange={() => { const updatedRooms = [...rooms]; updatedRooms[index].isAvailable = !updatedRooms[index].isAvailable; setRooms(updatedRooms) }}
                      className="sr-only peer"
                    />

                    {/* Background Track */}
                    <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-300"></div>

                    {/* Toggle Knob */}
                    <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-5" />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RoomListPage


