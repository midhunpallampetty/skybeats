'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '@/redux/store';
import { setGuestDetails } from '@/redux/slices/bookdetailSlice';
import BookingSummaryModal from '../components/HotelModal';
import Cookies from 'js-cookie';

const HotelBookDetail: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter(); 
  const bookdata = useSelector((state: RootState) => state.hotelGuestData.selectedUser);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null); // State to manage form error messages
  const updatedGuestDetails = useSelector((state: RootState) => state.bookdetail.guestDetails);
  const hotelBookingDetail = useSelector((state: RootState) => state.hotelBookDetail.selectedHotel);
  const token = Cookies.get('jwtToken');
const userId=Cookies.get('userId');
  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (!hotelBookingDetail) {
      router.push('/hotel');
    }
  }, [hotelBookingDetail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation check for empty fields
    if (!firstName || !lastName || !email || !phoneNumber) {
      setFormError('Please fill out all fields.');
      return;
    }

    // Clear error if all fields are filled
    setFormError(null);

    // Dispatch the guest details
    dispatch(setGuestDetails({
      firstName,
      lastName,
      email,
      phoneNumber,
    }));

    console.log('Updated Passenger Details State:', updatedGuestDetails);

    // Redirect to the payment page
    router.push('/hotel/payNow'); 
  };

  const handleShowModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(()=>{
    console.log(userId)
    if(!userId){
      router.push('/')
    }
    },[userId])
  return (
    <>
      <BookingSummaryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      <div className="bg-gray-900 text-white min-h-screen">
        <div className="relative h-64">
          <Image
            src="https://images2.alphacoders.com/258/thumb-1920-258412.jpg" 
            alt="Header Image"
            layout="fill"
            objectFit="cover"
            className="rounded-b-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-3xl font-bold">Add Guest Details</h1>
          </div>
        </div>

        <div className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow-lg">
          {hotelBookingDetail ? (
            <>
              <div className="flex justify-between mb-4">
                <div>
                  <p className='text-black font-extrabold'>{hotelBookingDetail.name}</p>
                  <p className='text-black font-extrabold'>{hotelBookingDetail?.overall_rating}</p>
                </div>
                <div>
                  <p className="text-right text-black font-extrabold">Fare Type: Regular</p>
                  <p className="text-right text-black font-extrabold">Total Guests: {bookdata?.guests}</p>
                  <p className="text-right text-black font-extrabold">Total Fare: ₹{bookdata?.amount}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg text-black font-extrabold">Rooms: {bookdata?.rooms}</p>
                  <p className="text-sm text-black font-extrabold">Bed Type: {bookdata?.bedType}</p>
                </div>
                <div className="flex space-x-4">
                  <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded" onClick={handleShowModal}>Details</button>
                </div>
              </div>
            </>
          ) : (
            <p className='text-black font-extrabold'>No hotels selected</p>
          )}
        </div>

        <div className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-black">Guest Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm text-black font-extrabold">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-black">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-black">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-black">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Display error if any field is missing */}
            {formError && (
              <div className="text-red-500 mt-4">
                {formError}
              </div>
            )}

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
    </>
  );
};

export default HotelBookDetail;
