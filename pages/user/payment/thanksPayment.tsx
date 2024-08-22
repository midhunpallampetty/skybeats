import React from 'react'
import Navbar from '@/pages/components/Navbar'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
const handleDownloadTicket=()=>{
    
}
const thanksPayment:React.FC=()=> {
    const selectedFlight = useSelector((state: RootState) => state.bookdetail.selectedFlight);
    const passengerDetails = useSelector((state: RootState) => state.bookdetail.passengerDetails);

  return (
    <>
    <Navbar/>
    <div className="bg-gray-900 border border-white text-white p-8 mt-20 max-w-4xl mx-auto rounded-lg">
  <header className="text-center mb-8">
    <h1 className="text-2xl font-semibold">Thank You for Your Booking</h1>
    <p className="text-lg">Your booking is confirmed!</p>
  </header>
  
  <div className="bg-gray-800 p-6 rounded-lg flex justify-between mb-8">
    <div className="w-1/3">
      <h2 className="text-lg font-semibold mb-4">Flight Details</h2>
      <p className="mb-2">{selectedFlight?.departureAirport} → {selectedFlight?.arrivalAirport}</p>
      <p className="mb-2">{selectedFlight?.departureTime} {selectedFlight?.departureAirport} - {selectedFlight?.arrivalTime} {selectedFlight?.departureAirport}</p>
      <p className="mb-2">Flight Number: {selectedFlight?.flightNumber}</p>
      <p>Stop: Non-Stop</p>
    </div>
    <div className="w-1/3">
      <h2 className="text-lg font-semibold mb-4">Passenger Details</h2>
      <p className="mb-2">Name:  {passengerDetails[0]?.firstName} {passengerDetails[0]?.lastName}</p>
      <p className="mb-2">Email: {passengerDetails[0]?.email}</p>
      <p>Phone: {passengerDetails[0]?.phoneNumber}</p>
    </div>
    <div className="w-1/3">
      <h2 className="text-lg font-semibold mb-4">Fare Details</h2>
      <p className="mb-2">Total Passengers: 1</p>
      <p>Total Fare: {selectedFlight?.price}</p>
    </div>
  </div>

  <div className="text-center">
    <button 
      onClick={handleDownloadTicket} 
      className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Download E-Ticket
    </button>
  </div>
</div>
    </>
    

  )
}

export default thanksPayment