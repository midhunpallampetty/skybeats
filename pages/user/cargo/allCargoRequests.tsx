'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Cookies from 'js-cookie';

const AllCargoRequests = () => {
  const Navbar = dynamic(() => import('../../components/Navbar'), { ssr: false });
  const [cargoRequests, setCargoRequests] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Add loading state
  const userId = Cookies.get('userId');

  useEffect(() => {
    const CargoRequests = async () => {
      try {
        const response = await axios.post('/api/getCargoBookings', {
          userId,
          header: {
            'Content-Type': 'application/json'
          }
        });

        console.log(response.data, 'Response data from API'); // Check API response structure

        // Assuming response.data is the array of cargo requests
        setCargoRequests(response.data.data);

      } catch (error) {
        console.error('Error fetching cargo requests:', error);
      } finally {
        // Add a delay of 1.5 seconds before setting loading to false
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    if (userId) {
      CargoRequests();
    }
  }, [userId]);

  console.log(cargoRequests);

  return (
    <>
      <Navbar />
      <div className="w-full h-screen bg-dark-blue mt-20">
        {/* Main Content */}
        <main className="w-full p-6 flex flex-col items-center overflow-y-scroll">
          {/* Header Section */}
          <section className="mb-8 w-4/5">
            <div className="relative w-full h-60 bg-blue-800 rounded-lg overflow-hidden">
              <img
                src="https://images3.alphacoders.com/135/1350069.jpeg"
                alt="Event Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-purple-600 px-4 py-2 rounded-full text-white">
                Based On Your Cargo Requests
              </div>
            </div>
          </section>

          {/* Cargo Requests (Card Grid) */}
          <section className="w-4/5">
            <h2 className="text-2xl font-semibold text-white mb-4">Cargo Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {/* Skeleton loading */}
              {loading ? (
                // Show skeletons while data is being fetched
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-blue-950 rounded-lg overflow-hidden shadow shadow-white/15 font-extrabold text-white animate-pulse"
                  >
                    <div className="p-8">
                      <div className="flex items-center">
                        <div className="w-32 h-32 rounded-lg bg-gray-700 mr-6"></div>
                        <div className="space-y-2 w-full">
                          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-700 rounded w-full"></div>
                          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Display cargo requests once loaded
                cargoRequests && cargoRequests.length > 0 ? (
                  cargoRequests.map((request, index) => (
                    <div
                      key={index}
                      className="bg-blue-950 rounded-lg overflow-hidden shadow shadow-white/15 font-extrabold text-white"
                    >
                      <div className="p-8">
                        <div className="flex items-center">
                          <img
                            src="https://images7.alphacoders.com/134/thumb-1920-1343309.png"
                            alt={request.packageName}
                            className="w-32 h-32 rounded-lg object-cover mr-6"
                          />
                          <div className="text-base">
                            <p>Package Name: {request.packageName}</p>
                            <p>Receiver Name: {request.receiverName}</p>
                            <p>Description: {request.descriptionOfGoods}</p>
                            <p>Tracking ID: {request.trackingId}</p>
                            <p>Date Received: {new Date(request.Date_Received).toLocaleDateString()}</p>
                            <p>Status: {request.approved ? 'Approved' : request.rejected ? 'Rejected' : 'Pending'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white">No cargo requests found.</p>
                )
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default AllCargoRequests;
