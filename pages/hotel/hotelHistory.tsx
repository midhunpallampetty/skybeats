'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { bookData } from '@/interfaces/bookData';
import axios from 'axios';
import Cookies from 'js-cookie';

const Navbar = dynamic(() => import('../components/Navbar'));
const MapModal = dynamic(() => import('../components/mapModal'), { ssr: false });
const HotelBookingDetailsModal = dynamic(() => import('../components/hotelBookingDetails'), { ssr: false });

const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<bookData[]>([]);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<bookData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const itemsPerPage = 5;
  const router = useRouter();
  const token = Cookies.get('jwtToken');

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await axios.get('/api/getHotelBookings');
        const bookingsWithParsedLocation = response?.data.map((booking: any) => ({
          ...booking,
          hotelLocation: booking.hotelLocation ? JSON.parse(booking.hotelLocation) : null,
        }));
        setBookings(bookingsWithParsedLocation);
      } catch (error) {
        console.log('An error occurred', error);
      }
    };
    fetchData();
  }, []);

  // Sorting bookings by createdAt date
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = sortedBookings.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openMapModal = (latitude: number, longitude: number) => {
    setSelectedLocation({ latitude, longitude });
    setIsMapModalOpen(true);
  };

  const closeMapModal = () => {
    setIsMapModalOpen(false);
    setSelectedLocation(null);
  };

  const openDetailsModal = (booking: bookData) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <>
      <Navbar />

      {/* Map Modal */}
      {selectedLocation && (
        <MapModal
          open={isMapModalOpen}
          onClose={closeMapModal}
          latitude={selectedLocation.latitude}
          longitude={selectedLocation.longitude}
        />
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <HotelBookingDetailsModal
          open={isDetailsModalOpen}
          onClose={closeDetailsModal}
          bookingDetails={selectedBooking}
        />
      )}

      <div className="bg-dark-blue min-h-screen p-8 text-white">
        <h1 className="text-3xl font-bold mb-8 text-center">View Booked Tickets</h1>

        <div className="flex justify-end mb-4">
          <select className="bg-blue-950/50 text-white p-2 rounded" value={sortOrder} onChange={handleSortChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {currentBookings.map((booking, index) => (
          <div key={index} className="bg-blue-950/50 border border-gray-800 p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">{booking.guestName}</h2>
                <p className="text-sm">{booking.phoneNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">Created At: {formatDate(booking.createdAt)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-transparent border border-white/5 p-4 rounded-lg mb-4">
              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => openDetailsModal(booking)}
                >
                  Details
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                {booking.hotelLocation && (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => openMapModal(booking.hotelLocation.latitude, booking.hotelLocation.longitude)}
                  >
                    View on Map
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center space-x-4 mt-8">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingHistory;
