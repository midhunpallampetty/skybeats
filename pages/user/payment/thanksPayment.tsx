import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Navbar from '../../components/Navbar';
import { useReactToPrint } from 'react-to-print';

export default function ThanksPayment() {
  const selectedFlight = useSelector((state: RootState) => state.bookdetail.selectedFlight);
  const passengerDetails = useSelector((state: RootState) => state.bookdetail.passengerDetails);
  const selectedSeat = useSelector((state: RootState) => state.selectedSeats.selectedSeats);

  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownloadTicket = useReactToPrint({
    content: () => ticketRef.current,
    documentTitle: 'E-Ticket',
    onAfterPrint: () => alert('Ticket downloaded successfully!'),
  });

  // Ensure data is available
  if (!selectedFlight || !passengerDetails.length || !selectedSeat.length) {
    return <div className="text-center mt-20">Loading...</div>; // Simple loading state
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div
          className="max-w-4xl mx-auto mt-20 bg-white/90 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden"
          ref={ticketRef}
        >
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">Thank You for Your Booking</h1>
            <p className="text-xl text-gray-600">Your booking is confirmed!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            <DetailCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              title="Flight Details"
              details={[
                `${selectedFlight.departureAirport} → ${selectedFlight.arrivalAirport}`,
                `${selectedFlight.departureTime} - ${selectedFlight.arrivalTime}`,
                `Flight Number: ${selectedFlight.flightNumber}`,
                'Stop: Non-Stop',
              ]}
            />
            <DetailCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              title="Passenger Details"
              details={passengerDetails.map((passenger, index) => `Name: ${passenger.firstName} ${passenger.lastName}, Email: ${passenger.email}, Phone: ${passenger.phoneNumber}`).join('; ')}
            />
            <DetailCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Fare Details"
              details={[
                `Total Passengers: ${passengerDetails.length}`,
                `Total Fare: $${(selectedFlight.price * selectedSeat.length).toFixed(2)}`,
              ]}
            />
          </div>
          <div className="border-t border-gray-200 mt-8"></div>
          <div className="text-center p-8">
            <button
              onClick={handleDownloadTicket}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300 ease-in-out transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download E-Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, title, details }: { icon: React.ReactNode; title: string; details: string[] }) {
  return (
    <div className="bg-white/50 backdrop-blur-sm shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <ul className="space-y-2">
        {details.map((detail, index) => (
          <li key={index} className="text-sm text-gray-600">{detail}</li>
        ))}
      </ul>
    </div>
  );
}
