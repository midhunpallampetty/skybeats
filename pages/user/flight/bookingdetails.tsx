'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '@/redux/store';
import { setPassengerDetails } from '@/redux/slices/bookdetailSlice';
import Swal from 'sweetalert2';
import FoodMenuModal from '@/pages/components/foodMenuModal';
import Cookies from 'js-cookie';
import axios from 'axios'
import { clearSelectedReturnFlight } from '@/redux/slices/returnFlightSlice';
interface PassengerDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  age: string;
  passportNumber: string;
  disability: string;
}

interface CommonDetails {
  email: string;
  phoneNumber: string;
}

const BookingDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const selectedFlight = useSelector((state: RootState) => state.bookdetail.selectedFlight);
  const selectedSeat = useSelector((state: RootState) => state.selectedSeats.selectedSeats);
  const [passengerDetails, setPassengerDetailsState] = useState<PassengerDetails[]>([]);
  const [commonDetails, setCommonDetails] = useState<CommonDetails>({ email: '', phoneNumber: '' });
  const [errors, setErrors] = useState<Record<number, Record<string, boolean>>>({});
  const [commonErrors, setCommonErrors] = useState<Record<string, boolean>>({ email: false, phoneNumber: false });
  const passengers = useSelector((state: RootState) => state.bookdetail.passengerDetails);
  const returnFlight = useSelector((state: RootState) => state.returnFlights.selectedReturnFlight);
  const [isChecked, setIsChecked] = useState(false);
  const token = Cookies.get('jwtToken');
  const userId = Cookies.get('userId');
  async function savePassengerInfo() {
    console.log(passengerDetails, 'user');
  
    for (let i = 0; i < passengerDetails.length; i++) {
      const firstName = passengerDetails[i].firstName;
      const lastName = passengerDetails[i].lastName;
      const middleName = passengerDetails[i].middleName || ''; // Handle optional middleName
      const passportNumber = passengerDetails[i].passportNumber;
  
      const data = {
        input: {
          email: commonDetails.email,
          firstName,
          lastName,
          middleName,
          passportNumber,
          phone: commonDetails.phoneNumber,
          userId: userId,
        }
      };
      
      try {
        const response = await axios.post('/api/savePassengerInfo', data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(`Passenger info for ${firstName} ${lastName} saved successfully:`, response.data);
      } catch (error: any) {
        if (error.response) {
          console.log(`Error response for ${firstName} ${lastName}:`, error.response.data); 
        } else if (error.request) {
          console.log(`Error request for ${firstName} ${lastName}:`, error.request); 
        } else {
          console.log(`Unexpected error for ${firstName} ${lastName}:`, error.message); 
        }
      }
    }
  }
  
  
  const handleCheckboxChange = async() => {
    setIsChecked((prev) => !prev);    
  };

  useEffect(() => {
    if (returnFlight) {
      Swal.fire({
        title: 'Do you want to Continue With Return Flights?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: 'Don\'t save'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire('Continue With Return Flights!', '', 'success');

        } else if (result.isDenied) {
          dispatch(clearSelectedReturnFlight());

          Swal.fire('Return Flights are Removed', '', 'info');
        }
      });

    }
  }, [returnFlight, dispatch]);

  useEffect(() => {
    const fetchPassengerInfo = async () => {
      try {
        const response = await axios.post('/api/getPassengerInfo', { userId }, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        const passengerInfo = response.data.getPassengerInfo[0];
        console.log(response.data.getPassengerInfo[0],'csdcdc')
        if (passengerInfo) {
          const { firstName, middleName, lastName, passportNumber, phone, email } = passengerInfo;
          
          // Populate passenger details
          setPassengerDetailsState([{
            firstName: firstName || '',
            middleName: middleName || '',
            lastName: lastName || '',
            passportNumber: passportNumber || '',
            disability: '', // Add if this info is available
            age:"20",
          }]);
          
          // Populate common details
          setCommonDetails({
            email: email || '',
            phoneNumber: phone || '',
          });
        }
      } catch (error) {
        console.error('Error fetching passenger info:', error);
      }
    };
  
    fetchPassengerInfo();
  }, [userId]);
  
  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  
    if (passengerDetails.length === 0) {  // Check if passenger details are empty
      const initialPassengers = selectedSeat.map(() => ({
        firstName: '',
        middleName: '',
        lastName: '',
        age: '',
        passportNumber: '',
        disability: '',
      }));
      setPassengerDetailsState(initialPassengers);
    }
  
    validateCommonField('email', commonDetails.email);
    validateCommonField('phoneNumber', commonDetails.phoneNumber);
  }, [selectedSeat, token]);
  
  useEffect(() => {
    if (!token) {
      router.push('/');
    }

    // Initialize passenger details based on selected seats
    const initialPassengers = selectedSeat.map(() => ({
      firstName: '',
      middleName: '',
      lastName: '',
      age: '',
      passportNumber: '',
      disability: '',
    }));
    setPassengerDetailsState(initialPassengers);

    // Validate initial fields on load
    initialPassengers.forEach((_, index) => {
      validateField(index, 'firstName', '');
      validateField(index, 'lastName', '');
      validateField(index, 'middleName', '');
      validateField(index, 'passportNumber', '');
      validateField(index, 'age', '');
    });

    validateCommonField('email', commonDetails.email);
    validateCommonField('phoneNumber', commonDetails.phoneNumber);
  }, [selectedSeat, token]);



  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedPassengers = [...passengerDetails];
    updatedPassengers[index][field as keyof PassengerDetails] = value;
    setPassengerDetailsState(updatedPassengers);

    // Perform validation based on field
    validateField(index, field, value);
  };

  const handleCommonInputChange = (field: string, value: string) => {
    const updatedCommonDetails = { ...commonDetails, [field]: value };
    setCommonDetails(updatedCommonDetails);

    // Validate common fields
    validateCommonField(field, value);
  };

  const validateField = (index: number, field: string, value: string) => {
    const newErrors = { ...errors };
    let isError = false;

    switch (field) {
      case 'firstName':
      case 'lastName':
      case 'middleName':
        isError = !/^[A-Za-z]+$/.test(value);
        break;
      case 'passportNumber':
        isError = value.length < 6;
        break;
      case 'age':
        isError = isNaN(Number(value)) || Number(value) <= 0;
        break;
      default:
        break;
    }

    if (!newErrors[index]) {
      newErrors[index] = {};
    }
    newErrors[index][field] = isError;
    setErrors(newErrors);
  };

  const validateCommonField = (field: string, value: string) => {
    let isError = false;

    if (field === 'email') {
      isError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (field === 'phoneNumber') {
      isError = !/^[0-9]{10,15}$/.test(value);
    }

    setCommonErrors((prev) => ({ ...prev, [field]: isError }));
  };
  useEffect(()=>{
if(isChecked){
  savePassengerInfo()
}
  },[isChecked])
  const handleSubmit = async(e: React.FormEvent) => {
    // if(isChecked){
    //   await savePassengerInfo()
    //   alert('save successfully ')
    // }else{
    //   alert('need to tick box to save')
    // }
    e.preventDefault();

    // Validate all passenger fields
    passengerDetails.forEach((passenger, index) => {
      Object.keys(passenger).forEach((field) => {
        validateField(index, field, (passenger as any)[field]);
      });
    });

    // Validate common fields (email, phoneNumber)
    validateCommonField('email', commonDetails.email);
    validateCommonField('phoneNumber', commonDetails.phoneNumber);

    const hasPassengerErrors = Object.values(errors).some((errorSet) =>
      Object.values(errorSet).some((error) => error === true)
    );
    const hasCommonErrors = Object.values(commonErrors).some((error) => error === true);

    if (!hasPassengerErrors && !hasCommonErrors) {
      // Proceed to payment if no errors
      dispatch(setPassengerDetails({ ...commonDetails, passengers: passengerDetails }));
      console.log(passengers, 'passengers');
      router.push('/user/payment/payNow');
    } else {
      // Show error message if any errors are found
      Swal.fire({
        text: 'Please correct the errors in the form',
        icon: 'error',
        background: '#05043d',
      });
    }
  };


  return (
    <div className="bg-gray-700/50 text-white min-h-screen">
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

      <div className="container  shadow-inner border border-white/20 mx-auto p-6 mt-6 bg-black/45 rounded-lg">
        {selectedFlight ? (
          <>
            <div className="flex justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{selectedFlight.departureAirport} → {selectedFlight.arrivalAirport}</h2>
                <p>{selectedFlight.departureTime} - {selectedFlight.arrivalTime}</p>
                <p>{selectedFlight.duration}</p>
              </div>
              <div className="flex-1 text-right">
                <p>Fare Type: Regular</p>
                <p>Total Passengers: {selectedSeat.length}</p>
                <p>Total Fare: ₹{selectedFlight.price * selectedSeat.length}</p>
              </div>
            </div>

            {/* Additional Fares section */}
            <div className="text-center mb-6">
              <h1 className="text-lg font-semibold">Additional Fares</h1>
              {selectedSeat.map((seat, index) => (
                <p key={index}>
                  {seat.price === 499 && 'Economy'}
                  {seat.price === 899 && 'First Class'}
                  {seat.price === 1099 && 'Business Class'}
                  : ₹{seat.price}
                </p>

              ))}
              <button className='bg-blue-700/35 rounded-sm font-extrabold p-1'>Add Aditional </button>
              <FoodMenuModal />
            </div>

          </>
        ) : (
          <p>No flight selected</p>
        )}
      </div>

      {/* Common details (Email, Phone Number) */}
      <div className="container mx-auto p-6 mt-6 border border-white/20 bg-[#07152C] rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Contact Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="text"
                value={commonDetails.email}
                onChange={(e) => handleCommonInputChange('email', e.target.value)}
                className={`mt-1 block w-full bg-gray-800 border ${commonErrors.email ? 'border-red-500' : 'border-gray-700'
                  } rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter email"
              />
              {commonErrors.email && <p className="text-red-500 text-sm mt-1">Email is invalid.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                value={commonDetails.phoneNumber}
                onChange={(e) => handleCommonInputChange('phoneNumber', e.target.value)}
                className={`mt-1 block w-full bg-gray-800 border ${commonErrors.phoneNumber ? 'border-red-500' : 'border-gray-700'
                  } rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter phone number"
              />
              {commonErrors.phoneNumber && <p className="text-red-500 text-sm mt-1">Phone number is invalid.</p>}
            </div>
          </div>

          {/* Passenger details */}
          <h2 className="text-2xl font-semibold mb-4 mt-6">Passenger Details</h2>
          {selectedSeat.map((seat: any, index: number) => (
            <div key={index} className="mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold mb-4">Passenger {index + 1} (Seat {seat.seatNumber})</h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    value={passengerDetails[index]?.firstName}
                    onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                    className={`mt-1 block w-full bg-gray-800 border ${errors[index]?.firstName ? 'border-red-500' : 'border-gray-700'
                      } rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter first name"
                  />
                  {errors[index]?.firstName && <p className="text-red-500 text-sm mt-1">First name is invalid.</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium">Middle Name</label>
                  <input
                    type="text"
                    value={passengerDetails[index]?.middleName}
                    onChange={(e) => handleInputChange(index, 'middleName', e.target.value)}
                    className={`mt-1 block w-full bg-gray-800 border ${errors[index]?.middleName ? 'border-red-500' : 'border-gray-700'
                      } rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter middle name"
                  />
                  {errors[index]?.middleName && <p className="text-red-500 text-sm mt-1">Middle name is invalid.</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    value={passengerDetails[index]?.lastName}
                    onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                    className={`mt-1 block w-full bg-gray-800 border ${errors[index]?.lastName ? 'border-red-500' : 'border-gray-700'
                      } rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter last name"
                  />
                  {errors[index]?.lastName && <p className="text-red-500 text-sm mt-1">Last name is invalid.</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium">Age</label>
                  <input
                    type="text"
                    value={passengerDetails[index]?.age}
                    onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                    className={`mt-1 block w-full bg-gray-800 border ${errors[index]?.age ? 'border-red-500' : 'border-gray-700'
                      } rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter age"
                  />
                  {errors[index]?.age && <p className="text-red-500 text-sm mt-1">Age is invalid.</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium">Passport Number</label>
                  <input
                    type="text"
                    value={passengerDetails[index]?.passportNumber}
                    onChange={(e) => handleInputChange(index, 'passportNumber', e.target.value)}
                    className={`mt-1 block w-full bg-gray-800 border ${errors[index]?.passportNumber ? 'border-red-500' : 'border-gray-700'
                      } rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter passport number"
                  />
                  {errors[index]?.passportNumber && (
                    <p className="text-red-500 text-sm mt-1">Passport number is too short.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Disability (if any)</label>
                  <input
                    type="text"
                    value={passengerDetails[index]?.disability}
                    onChange={(e) => handleInputChange(index, 'disability', e.target.value)}
                    className={'mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm leading-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'}
                    placeholder="Enter disability (optional)"
                  />
                </div>
               
              </div>
            </div>
          ))}
 <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="w-6 h-6 mr-2 accent-red-700"
                  />
                  <label className="text-white font-extrabold">Save Detail</label>
                </div>
          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
