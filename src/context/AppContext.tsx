"use client"

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { UserResource, GetToken } from "@clerk/types";
import axios from "axios";
import toast from "react-hot-toast";
import { RoomType } from "@/types";

interface AppContextType {
    currency: string;
    router: ReturnType<typeof useRouter>;
    user: UserResource | null | undefined;
    getToken: GetToken;
    isOwner: boolean;
    setIsOwner: React.Dispatch<React.SetStateAction<boolean>>;
    showHotelReg: boolean;
    setShowHotelReg: React.Dispatch<React.SetStateAction<boolean>>;
    searchedCities: string[];
    setSearchedCities: React.Dispatch<React.SetStateAction<string[]>>;
    axios: typeof axios;
    rooms: RoomType[];
    setRooms: React.Dispatch<React.SetStateAction<RoomType[]>>;
    fetchRooms: () => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {

    const currency = process.env.CURRENCY || "€";
    const router = useRouter();     
    const { user } = useUser();
    const { getToken } = useAuth();

    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState<string[]>([]);
    const [rooms, setRooms] = useState<RoomType[]>([]);

    const fetchUser = async () => {
        const token = await getToken();

        try {
            const { data } = await axios.get("/api/user/getUser", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setIsOwner(data.role === "hotelOwner");
                setSearchedCities(data.recentSearchedCities);

            } else {
                // Retry fetching user details after 5 seconds
                setTimeout(() => {
                    fetchUser();
                }, 5000);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get("/api/hotel/getAllRooms");

            if (data.success) {
                setRooms(data.rooms);

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
            fetchUser();
        }
    }, [user]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const value = {
        currency,
        router,
        user,
        getToken,
        isOwner, setIsOwner,
        showHotelReg, setShowHotelReg,
        searchedCities, setSearchedCities,
        axios,
        rooms, setRooms,
        fetchRooms
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export default AppContextProvider;