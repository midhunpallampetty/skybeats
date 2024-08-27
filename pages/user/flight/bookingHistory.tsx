import React, { useEffect, useState } from 'react';
import Navbar from '@/pages/components/Navbar';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router=useRouter()
 const token=Cookies.get('jwtToken')
 useEffect(()=>{
 if(!token){
 router.push('/')
 }
 },[])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/getBookings');
        console.log(response.data, 'congratulations.........');
        setBookings(response?.data);
      } catch (error) {
        console.log('An error occurred', error);
      }
    };
    fetchData();
  }, []);

  // Calculate the indices for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  return (
    <>
      <Navbar />
      <div className="bg-dark-blue min-h-screen p-8 text-white">
        <h1 className="text-3xl font-bold mb-8 text-center">View Booked Tickets</h1>

        {currentBookings.map((booking, index) => (
          <div key={index} className="bg-blue-950/50 border border-gray-800 p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">{booking.passengerName}</h2>
                <p className="text-sm">{booking.passengerName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">Total Passengers: 1</p>
                <p className="text-lg font-bold">Total: ₹{booking?.FarePaid}</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-transparent border border-white/5 p-4 rounded-lg mb-4">
              <div>
                <p className="text-sm">{booking.departureTime}</p>
                <p className="text-sm">{booking.departureCode}</p>
                <p className="text-sm">Flight Duration: {booking.flightDuration}</p>
              </div>
              <div>
                <p className="text-sm">{booking.arrivalTime}</p>
                <p className="text-sm">{booking.arrivalCode}</p>
                <p className="text-sm">Arrival Time</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Details
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Cancel
                </button>
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
