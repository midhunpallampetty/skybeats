'use client';
import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
export default function BookingConfirmation() {
    const getGuestDetails=useSelector((state:RootState)=>state.hotelGuestData.selectedUser);

  const router=useRouter();

  useEffect(() => {
    const userId = Cookies.get('userId');
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (!userId || !accessToken || !refreshToken) {
      Cookies.remove('userId');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      router.push('/');  // Redirect to home or login page
    }
  }, [router]);
  console.log(getGuestDetails);
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4 ">
        <div className="bg-white rounded-lg shadow-md w-full max-w-2xl">
          <div className="text-center p-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for choosing Us. Your reservation is confirmed.
            </p>
          </div>
          <div className="px-6 pb-6 space-y-6">
            <div className="rounded-lg bg-gray-50 p-4">
              <h2 className="font-semibold text-lg mb-2">Booking Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Check-in: {getGuestDetails?.checkin}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Check-out: {getGuestDetails?.checkout}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Guests: {getGuestDetails?.guests}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Room: {getGuestDetails?.bedType}</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-2">Next Steps</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>Check your email for a detailed confirmation</li>
                <li>Review hotel policies and check-in instructions</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 px-6 py-4 flex justify-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
              View Full Booking Details
            </button>
            <button onClick={()=>router.push('/')} className="bg-blue-500 ml-2 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }