"use client"

import Title from "@/components/Title"
import Image from "next/image";
import { useState } from "react"
import { assets } from "../../../../public/assets";

type AmenityKey = "Free WiFi" | "Free Breakfast" | "Room Service" | "Mountain View" | "Pool Access";

const AddRoom = () => {

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

  return (
    <form>
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
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suit">Family Suit</option>
          </select>
        </div>

        <div>
          <p className="mt-4 text-gray-800">Price <span className="text-xs">/Per Night</span></p>
          <input onChange={(e) => setInputs({ ...inputs, pricePerNight: Number(e.target.value) })} value={inputs.pricePerNight}  type="number" placeholder="0" className="border border-gray-300 mt-1 rounded p-2 w-24" />
        </div>
      </div>

      <p className="text-gray-800 mt-4">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-600 max-w-sm">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index}>
            <input onChange={(e) => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity as AmenityKey]: !inputs.amenities[amenity as AmenityKey] } })} type="checkbox" id={`amenities ${index + 1}`} checked={inputs.amenities[amenity as AmenityKey]} />
            <label htmlFor={`amenities ${index + 1}`}> {amenity}</label>
          </div>
        ))}
      </div>

      <button type="submit" className="bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer">Add Room</button>
    </form>
  )
}

export default AddRoom
