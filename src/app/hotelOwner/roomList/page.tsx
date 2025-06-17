"use client"

import { useCallback, useContext, useEffect, useState } from "react"

import Title from "@/components/Title";
import { AppContext } from "@/context/AppContext";
import { RoomType } from "@/types";
import toast from "react-hot-toast";

const RoomListPage = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("RoomListPage must be within AppContextProvider");
  const { axios, getToken, user, currency, router } = context;

  const [rooms, setRooms] = useState<RoomType[] | null>([]);

  // ✅ Wrap fetchRooms in useCallback so it can be used safely in useEffect
  const fetchRooms = useCallback(async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/hotel/getOwnerRooms", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setRooms(data.ownerRooms);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  }, [axios, getToken]);

  // Toggle availability of the room
  const toggleAvailability = async (roomId: string) => {
    try {
      const { data } = await axios.post("/api/hotel/changeAvailability", { roomId });

      if (data.success) {
        toast.success(data.message);
        await fetchRooms(); // ✅ still works with useCallback

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user, fetchRooms]); // ✅ Warning gone

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
            {rooms?.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">{item.roomType}</td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">{item.amenities.join(", ")}</td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">{currency} {item.pricePerNight}</td>
                <td className="py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center">
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer w-12 h-7">
                      <input
                        type="checkbox"
                        checked={item.isAvailable}
                        onChange={() => toggleAvailability(item._id)}
                        className="sr-only peer"
                      />
                      <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-300"></div>
                      <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-5" />
                    </label>

                    <button onClick={() => router.push(`/hotelOwner/updateRoom/${item._id}`)} className="border-none bg-blue-600 text-stone-50 px-2.5 py-[2px] md:px-3 md:py-[3px] rounded-xl uppercase text-xs md:text-sm cursor-pointer">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RoomListPage;
