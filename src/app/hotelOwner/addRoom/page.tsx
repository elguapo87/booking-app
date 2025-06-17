"use client"

import Title from "@/components/Title"
import Image from "next/image";
import { useContext, useState } from "react"
import { assets } from "../../../../public/assets";
import toast from "react-hot-toast";
import { AppContext } from "@/context/AppContext";

type AmenityKey = "Free WiFi" | "Free Breakfast" | "Room Service" | "Mountain View" | "Pool Access";

const AddRoom = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("AddRoomPage must be within AppContextProvider");
  const { axios, getToken, fetchRooms } = context;

  const [images, setImages] = useState<{ [key: string]: File | null }>({
    "1": null,
    "2": null,
    "3": null,
    "4": null
  });

  const [inputs, setInputs] = useState<{
    roomType: string;
    pricePerNight: number;
    amenities: Record<AmenityKey, boolean>
  }>({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free WiFi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false
    }
  });

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Check if all inputs are filled
    if (!inputs.roomType || !inputs.pricePerNight || !inputs.amenities || !Object.values(images).some((image) => image)) {
      toast.error("Please fill in all the details");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();

      const formData = new FormData();
      formData.append("roomType", inputs.roomType);
      formData.append("pricePerNight", inputs.pricePerNight.toString());

      // Converting amenities to array & keeping only enabled amenities
      const amenities = (Object.keys(inputs.amenities) as AmenityKey[]).filter((key) => inputs.amenities[key]);
      formData.append("amenities", JSON.stringify(amenities));

      // Adding images to form data
      Object.keys(images).forEach((key) => {
        if (images[key]) {
          formData.append("images", images[key]!);
        }
      });

      const { data } = await axios.post("/api/hotel/addRoom", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message);
        fetchRooms();
        setInputs({
          roomType: "",
          pricePerNight: 0,
          amenities: {
            "Free WiFi": false,
            "Free Breakfast": false,
            "Room Service": false,
            "Mountain View": false,
            "Pool Access": false
          }
        });
        setImages({
          "1": null,
          "2": null,
          "3": null,
          "4": null
        });

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <Title
        title="Add Room"
        subTitle="Fill in the details carefully and accurate room details, pricing, and amenities,
                  to enhance user booking experience"
        align="left"
        font="outfit"
      />

      {/* UPLOAD AREA FOR IMAGES */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label key={key} htmlFor={`roomImage${key}`}>
            <Image
              src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
              alt=""
              width={100}
              height={100}
              className="max-h-13 cursor-pointer opacity-80"
            />
            <input type="file"
              onChange={(e) => setImages({ ...images, [key]: e.target.files && e.target.files[0] ? e.target.files[0] : null })}
              accept="image/*"
              id={`roomImage${key}`}
              hidden
            />
          </label>
        ))}
      </div>

      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })} value={inputs.roomType} className="border border-gray-300 opacity-70 mt-1 rounded p-2 w-full">
            <option value="any">any</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div>
          <p className="mt-4 text-gray-800">Price <span className="text-xs">/Per Night</span></p>
          <input onChange={(e) => setInputs({ ...inputs, pricePerNight: Number(e.target.value) })} value={inputs.pricePerNight} type="number" placeholder="0" className="border border-gray-300 mt-1 rounded p-2 w-24" />
        </div>
      </div>

      <p className="text-gray-800 mt-4">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-600 max-w-sm">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index}>
            <input onChange={() => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity as AmenityKey]: !inputs.amenities[amenity as AmenityKey] } })} type="checkbox" id={`amenities ${index + 1}`} checked={inputs.amenities[amenity as AmenityKey]} />
            <label htmlFor={`amenities ${index + 1}`}> {amenity}</label>
          </div>
        ))}
      </div>

      <button type="submit" className="bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer" disabled={loading}>
        {loading ? "Adding..." : "Add Room"}
      </button>
    </form>
  )
}

export default AddRoom
