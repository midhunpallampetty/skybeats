import Navbar from '@/pages/components/Navbar';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { setSeats } from '@/redux/slices/seatSlice';
import { useRouter } from 'next/router';
import { setSelectedSeat, clearSelectedSeat } from '@/redux/slices/selectedSeat'; // Import clearSelectedSeats action

const SelectSeats: React.FC = () => {
    const router=useRouter()
    const dispatch = useDispatch<AppDispatch>();
    const seats = useSelector((state: RootState) => state.seats.seats);
    const selectedFlight = useSelector((state: RootState) => state.bookdetail.selectedFlight);
    const selectedSeats = useSelector((state: RootState) => state.selectedSeats.selectedSeat);
    const [localSelectedSeat, setLocalSelectedSeat] = useState<any>(null); // Local state for selected seat UI
    const seatDetailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const response = await fetch('/api/getSeats', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ flightNumber: selectedFlight?.flightNumber }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched seats data:', data);
                dispatch(setSeats(data || []));
            } catch (error: any) {
                console.error('Error fetching seats:', error.message);
            }
        };

        if (selectedFlight?.flightNumber) {
            fetchSeats();
        }
    }, [dispatch, selectedFlight?.flightNumber]);

    const handleSeatClick = (seat: any) => {
        setLocalSelectedSeat(seat);
        dispatch(setSelectedSeat(seat)); // Add selected seat to Redux store
  console.log(selectedSeats,'hbvhdfvgbsdhfgv')
        // Scroll to seat details
        if (seatDetailsRef.current) {
            seatDetailsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handle proceeding with selected seat
    const handleContinueWithSelectedSeat = () => {
        if (localSelectedSeat) {
            router.push('/user/flight/bookingdetails')
            console.log('Proceeding with selected seat:', localSelectedSeat);
            // Navigate or perform actions to continue with the selected seat
        } else {
            console.log('No seat selected.');
        }
    };

    // Handle skipping seat selection
    const handleSkipSelection = () => {
        setLocalSelectedSeat(null);
        dispatch(clearSelectedSeat()); 
        router.push('/user/flight/bookingdetails')
        console.log('Proceeding without selecting a seat');
        // Navigate or perform actions to continue without seat selection
    };

    return (
        <>
            <Navbar />
            <div className='relative flex justify-center mt-[150px] items-center min-h-screen'>
                <Image src='/Ticket_layout.png' width={900} height={1000} alt='Ticket layout' />
                {seats.length > 0 ? (
                    seats.map((seat, index) => (
                        <div
                            key={index}
                            className='absolute ml-[670px] mt-[70px] flex justify-center items-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer'
                            style={{ top: `${seat.y}px`, left: `${seat.x}px` }}
                            onClick={() => handleSeatClick(seat)}
                        >
                            <svg
                                className='w-8 h-12'
                                fill={seat.isBooked ? 'red' : 'dark'}
                                width='15'
                                height='15'
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 512"
                            >
                                <path d="M64 160C64 89.3 121.3 32 192 32l256 0c70.7 0 128 57.3 128 128l0 33.6c-36.5 7.4-64 39.7-64 78.4l0 48-384 0 0-48c0-38.7-27.5-71-64-78.4L64 160zM544 272c0-20.9 13.4-38.7 32-45.3c5-1.8 10.4-2.7 16-2.7c26.5 0 48 21.5 48 48l0 176c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32L96 448c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32L0 272c0-26.5 21.5-48 48-48c5.6 0 11 1 16 2.7c18.6 6.6 32 24.4 32 45.3l0 48 0 32 32 0 384 0 32 0 0-32 0-48z"/>
                            </svg>
                        </div>  
                    ))
                ) : (
                    <p>No seats available</p>
                )}
            </div>

            {localSelectedSeat && (
                <div ref={seatDetailsRef} className='mt-4 p-4 w-[350px] h-[200px] bg-white/10 border border-white/10 rounded shadow-md'>
                    <h3 className='text-3xl text-white font-extrabold'>Selected Seat Details:</h3>
                    <p className='font-semibold text-white text-2xl'>Seat Number: {localSelectedSeat.row}{localSelectedSeat.col}</p>
                    <p className='font-semibold text-white text-2xl'>Class: {localSelectedSeat.class}</p>
                </div>
            )}

            {/* Buttons for proceeding */}
            <div className="flex justify-center mt-8 space-x-4">
                <button
                    onClick={handleContinueWithSelectedSeat}
                    className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
                >
                    Continue with Selected Seat
                </button>

                <button
                    onClick={handleSkipSelection}
                    className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
                >
                    Skip Selection
                </button>
            </div>
        </>
    );
};

export default SelectSeats;
