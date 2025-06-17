"use client"

import Title from "@/components/Title"
import Image from "next/image";
import { useContext, useEffect, useState } from "react"

import toast from "react-hot-toast";
import { AppContext } from "@/context/AppContext";
import { assets } from "../../../../../public/assets";
import { useParams } from "next/navigation";
import { RoomType } from "@/types";

type AmenityKey = "Free WiFi" | "Free Breakfast" | "Room Service" | "Mountain View" | "Pool Access";

const UpdateRoom = () => {

    const { id } = useParams() as { id: string };

    const context = useContext(AppContext);
    if (!context) throw new Error("AddRoomPage must be within AppContextProvider");
    const { axios, getToken, fetchRooms, rooms, router } = context;

    const [loading, setLoading] = useState(false);

    const [room, setRoom] = useState<RoomType | null>(null);

    const [images, setImages] = useState<{ [key: string]: File | null }>({
        "1": null,
        "2": null,
        "3": null,
        "4": null
    });

    const [previewImages, setPreviewImages] = useState<{ [key: string]: string }>({
        "1": "",
        "2": "",
        "3": "",
        "4": ""
    })

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

    const onSubmitHandler = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        setLoading(true)
        
        try {
            const token = await getToken();

            const formData = new FormData();
            formData.append("roomType", inputs.roomType);
            formData.append("pricePerNight", inputs.pricePerNight.toString());

            // Converting amenities to array & keeping only enabled amenities
            const amenities = (Object.keys(inputs.amenities) as AmenityKey[]).filter((key) => inputs.amenities[key]);
            formData.append("amenities", JSON.stringify(amenities));

            formData.append("roomId", id);

            // Adding images to form data
            Object.keys(images).forEach((key) => {
                images[key] && formData.append("images", images[key]);
            });

            Object.keys(previewImages).forEach((key) => {
                if (!images[key]) {
                    formData.append("existingImages", previewImages[key]);
                }
            });

            const { data } = await axios.post("/api/hotel/updateRoom", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success(data.message);
                fetchRooms();
                router.push("/hotelOwner/roomList");

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

    useEffect(() => {
        const foundRoom = rooms.find((room) => room._id === id);
        if (foundRoom) {
            setRoom(foundRoom);

            setInputs({
                roomType: foundRoom.roomType,
                pricePerNight: foundRoom.pricePerNight,
                amenities: {
                    "Free WiFi": foundRoom.amenities.includes("Free WiFi"),
                    "Free Breakfast": foundRoom.amenities.includes("Free Breakfast"),
                    "Room Service": foundRoom.amenities.includes("Room Service"),
                    "Mountain View": foundRoom.amenities.includes("Mountain View"),
                    "Pool Access": foundRoom.amenities.includes("Pool Access")
                }
            })

            if (foundRoom.images) {
                const previews: { [key: string]: string } = {};
                foundRoom.images.forEach((url, index) => {
                    previews[String(index + 1)] = typeof url === "string" ? url : url.src;
                });
                setPreviewImages(previews);
            }
        }
    }, [id, rooms]);

    return (
        <form onSubmit={onSubmitHandler}>
            <Title
                title="Edit Room"
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
                            src={images[key] ? URL.createObjectURL(images[key]) : previewImages[key] || assets.uploadArea}
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
                        <input onChange={(e) => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity as AmenityKey]: !inputs.amenities[amenity as AmenityKey] } })} type="checkbox" id={`amenities ${index + 1}`} checked={inputs.amenities[amenity as AmenityKey]} />
                        <label htmlFor={`amenities ${index + 1}`}> {amenity}</label>
                    </div>
                ))}
            </div>

            <button type="submit" className="bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer" disabled={loading}>
                {loading ? "Updating..." : "Update Room"}
            </button>
        </form>
    )
}

export default UpdateRoom


