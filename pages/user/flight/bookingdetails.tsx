import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router'; // Import useRouter hook
import { RootState } from '@/redux/store';
import { setPassengerDetails } from '@/redux/slices/bookdetailSlice';
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';
import axios from 'axios';
interface SeatInput {
  aircraftId: string;
  holdSeatId: string;
}
const BookingDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter(); 
  const selectedFlight = useSelector((state: RootState) => state.bookdetail.selectedFlight);
  const [firstName, setFirstName] = useState('');
  const selectedSeat = useSelector((state: RootState) => state.selectedSeats.selectedSeats);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const updatedPassengerDetails = useSelector((state: RootState) => state.bookdetail.passengerDetails);
 const token=Cookies.get('jwtToken');
 const userId=Cookies.get('userId')
  useEffect(()=>{
  if(!token){
  router.push('/')
  }
 },[])
 const validateFirstName = () => {
  const nameRegex = /^[A-Za-z]+$/;
  if (!firstName || !nameRegex.test(firstName)) {
    setFirstNameError(true);
  } else {
    setFirstNameError(false);
  }
};

const validateLastName = () => {
  const nameRegex = /^[A-Za-z]+$/;
  if (!lastName || !nameRegex.test(lastName)) {
    setLastNameError(true);
  } else {
    setLastNameError(false);
  }
};

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    setEmailError(true);
  } else {
    setEmailError(false);
  }
};

const validatePhoneNumber = () => {
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
    setPhoneNumberError(true);
  } else {
    setPhoneNumberError(false);
  }
};

//  useEffect(() => {
 
//   const selectedSeats=selectedSeat?._id
//   const checkSeat = async () => {
//     try {
//       const input = {



//         aircraftId: selectedFlight?.flightNumber,
//         holdSeatId: selectedSeat?._id,
//         userId:userId
//       };
//     // coach is here {
//     //   input: { aircraftId: '435', holdSeatId: '66bf62e12eeef2be9e3544d0' }
//     // }
// console.log(input,'testing..........');
//       const response = await axios.post(
//         '/api/checkSeat',
//         { input },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
  
//      const status=response.data.checkSeat;
//       console.log('Seat checked successfully:', status);
//       if(status){
//         Swal.fire({
         
//           text: "Something Went Wrong",
//           icon: "info",
//           background:"#05043d"
//         });
        
//         router.push('/user/flight/listflights')
        
//       }
//     } catch (error: any) {
//       console.error('Error checking seat:', error.response ? error.response.data : error.message);
//     }
//   };


//   // checkSeat();
// }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!firstNameError && !lastNameError && !emailError && !phoneNumberError){
      console.log(selectedSeat,'fgbfggb')
      dispatch(setPassengerDetails({
        firstName,
        lastName,
        email,
        phoneNumber,
      }));
      console.log("Updated Passenger Details State:", updatedPassengerDetails);
      router.push('/user/payment/payNow'); 
    }
    
  };

  return (
    <div className="bg-gray-900 text-white  min-h-screen">
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

      <div className="container shadow-white/35 shadow-inner border border-white/20  mx-auto p-6 mt-6 bg-[#07152C] rounded-lg ">
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

      <div className="container mx-auto p-6 mt-6 border border-white/20 bg-[#07152C] rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Passenger Details</h2>
        <form onSubmit={handleSubmit}>
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div>
      <label className="block text-sm font-medium">First Name</label>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        onBlur={validateFirstName}
        className={`mt-1 block w-full bg-gray-800 border ${firstNameError ? 'border-red-500' : 'border-gray-700'} rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder="Enter your first name"
        
      />
      {firstNameError && (
        <p className="text-red-500 text-sm mt-1">First name should only contain alphabetic characters.</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium">Last Name</label>
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        onBlur={validateLastName}
        className={`mt-1 block w-full bg-gray-800 border ${lastNameError ? 'border-red-500' : 'border-gray-700'} rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder="Enter your last name"
        
      />
      {lastNameError && (
        <p className="text-red-500 text-sm mt-1">Last name should only contain alphabetic characters.</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={validateEmail}
        className={`mt-1 block w-full bg-gray-800 border ${emailError ? 'border-red-500' : 'border-gray-700'} rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder="Enter your email"
        
      />
      {emailError && (
        <p className="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium">Phone Number</label>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        onBlur={validatePhoneNumber}
        className={`mt-1 block w-full bg-gray-800 border ${phoneNumberError ? 'border-red-500' : 'border-gray-700'} rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder="Enter your phone number"
        
      />
      {phoneNumberError && (
        <p className="text-red-500 text-sm mt-1">Please enter a valid phone number (digits only, 10-15 characters).</p>
      )}
    </div>
  </div>

  <div className="mt-6 flex justify-end">
    <button
      type="submit"
      className="bg-green-500 text-white font-semibold px-4 py-2 rounded"
      disabled={firstNameError || lastNameError || emailError || phoneNumberError}
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
