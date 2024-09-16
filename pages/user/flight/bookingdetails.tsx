import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router'; // Import useRouter hook
import { RootState } from '@/redux/store';
import { setPassengerDetails } from '@/redux/slices/bookdetailSlice';
import Cookies from 'js-cookie';
const BookingDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter(); 
  const selectedFlight = useSelector((state: RootState) => state.bookdetail.selectedFlight);
  const [firstName, setFirstName] = useState('');
  const selectedSeat = useSelector((state: RootState) => state.selectedSeats.selectedSeat);

  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const updatedPassengerDetails = useSelector((state: RootState) => state.bookdetail.passengerDetails);
 const token=Cookies.get('jwtToken');
  useEffect(()=>{
  if(!token){
  router.push('/')
  }
 },[])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(selectedSeat,'fgbfggb')
    dispatch(setPassengerDetails({
      firstName,
      lastName,
      email,
      phoneNumber,
    }));
    console.log("Updated Passenger Details State:", updatedPassengerDetails);
    router.push('/user/payment/payNow'); 
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="relative h-64">
        <Image
          src="/ai-generated.jpg" 
          alt="Header Image"
          layout="fill"
          objectFit="cover"
          className="rounded-b-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-3xl font-bold">Add Passenger Details</h1>
        </div>
      </div>

      <div className="container mx-auto p-6 mt-6 bg-[#07152C] rounded-lg shadow-lg">
        {selectedFlight ? (
          <>
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">{selectedFlight.departureAirport} → {selectedFlight.arrivalAirport}</h2>
                <p>{selectedFlight.departureTime} - {selectedFlight.arrivalTime}</p>
                <p>{selectedFlight.duration}</p>
              </div>
              <div>
                <p className="text-right">Fare Type: Regular</p>
                <p className="text-right">Total Passengers: 1</p>
                <p className="text-right">Total Fare: ₹{selectedFlight.price}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg">Flight Number: {selectedFlight.flightNumber}</p>
                <p className="text-sm">Stop: {selectedFlight.stops}</p>
              </div>
              <div className="flex space-x-4">
                <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded">Details</button>
                <button className="bg-red-500 text-white font-semibold px-4 py-2 rounded">Cancel</button>
              </div>
            </div>
          </>
        ) : (
          <p>No flight selected</p>
        )}
      </div>

      <div className="container mx-auto p-6 mt-6 bg-[#07152C] rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Passenger Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
            {/* Add more form fields as needed */}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white font-semibold px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
