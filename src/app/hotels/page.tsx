"use client";

import AllHotels from "@/components/AllHotels";
import { AppContext } from "@/context/AppContext";
import { RoomType } from "@/types";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type OwnerType = {
  username: string;
  image: string;
};

type AllHotelsData = {
  _id: string;
  name: string;
  address: string;
  contact: string;
  city: string;
  image: string;
  owner: OwnerType;
  rooms: RoomType;
};

const HotelsPage = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("HotelsPage must be within AppContextProvider");
  const { axios } = context;

  const [hotels, setHotels] = useState<AllHotelsData[] | null>(null);

  const fetchData = async () => {
    try {
      const [hotelRes, roomRes] = await Promise.all([
        axios.get("/api/hotel/getAllHotels"),
        axios.get("/api/hotel/getAllRooms"),
      ]);

      if (hotelRes.data.success && roomRes.data.success) {
        const allHotels = hotelRes.data.hotels;
        const allRooms = roomRes.data.rooms;

        // Attach rooms to each hotel
        const hotelsWithRooms = allHotels.map((hotel: AllHotelsData) => ({
          ...hotel,
          rooms: allRooms.filter((room: RoomType) => room.hotel._id === hotel._id)
        }));

        setHotels(hotelsWithRooms);

      } else {
        toast.error("Failed to fetch hotels or rooms");
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mx-4 md:mx-16 lg:mx-32 mt-20 md:mt-30 pb-20 md:pb-40">
      {hotels?.map((hotel) => (
        <AllHotels key={hotel._id} hotel={hotel} />
      ))}
    </div>
  );
};

export default HotelsPage;
