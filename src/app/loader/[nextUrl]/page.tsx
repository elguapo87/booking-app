"use client"

import { AppContext } from '@/context/AppContext';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect } from 'react'

const Loader = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("Loader must be within AppContextProvider");
    const { router } = context;

    const { nextUrl } = useParams() as { nextUrl: string };

    useEffect(() => {
        if (nextUrl) {
            setTimeout(() => {
                router.push(`/${nextUrl}`);
            }, 8000)
        }
    }, [nextUrl]);

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary'></div>
        </div>
    )
}

export default Loader
