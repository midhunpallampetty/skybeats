// App.tsx
import React, { useState } from 'react';
import ShowBookings from '../components/ShowBookings';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface Flight {
  name: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
}

const Test: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const flights = useSelector((state: RootState) => state.flights.flights);


  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Flight Listing App</h1>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Show Flights
      </button>

      <ShowBookings  />
    </div>
  );
};

export default Test;
