"use client";

import Hotel from "@/components/AllHotels";
import { AppContext } from "@/context/AppContext";
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
};

const HotelsPage = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("HotelReg must be within AppContextProvider");
  const { axios } = context;

  const [hotels, setHotels] = useState<AllHotelsData[] | null>(null);

  const fetchHotels = async () => {
    try {
      const { data } = await axios.get("/api/hotel/getAllHotels");

      if (data.success) {
        setHotels(data.hotels);
        console.log(hotels);
        
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mx-4 md:mx-16 lg:mx-32 mt-20 md:mt-30 pb-20 md:pb-40">
      {hotels?.map((hotel) => (
        <Hotel key={hotel._id} hotel={hotel} />
      ))}
    </div>
  );
};

export default HotelsPage;
